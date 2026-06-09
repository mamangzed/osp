//! owl-auth: token validation for OSP.
//!
//! Two validators:
//! - `JwtValidator`: validates HS256-signed JWTs against a shared secret
//! - `ApiKeyValidator`: validates opaque API keys against an in-memory map
//!
//! Both return a `Claims` struct with `device_id` and `collection_scopes`.

#![forbid(unsafe_code)]

use owl_types::DeviceId;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AuthError {
    #[error("invalid token: {0}")]
    Invalid(String),
    #[error("token expired")]
    Expired,
    #[error("missing scope: {0}")]
    MissingScope(String),
    #[error("internal: {0}")]
    Internal(String),
}

pub type AuthResult<T> = std::result::Result<T, AuthError>;

/// Claims returned by a successful token validation.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Claims {
    /// Subject — the device_id this token authenticates.
    pub device_id: DeviceId,
    /// Expiration timestamp (seconds since epoch).
    pub exp: i64,
    /// Issued-at timestamp (seconds since epoch).
    #[serde(default)]
    pub iat: i64,
    /// Collection-level scopes (e.g. "users", "orders").
    /// Empty means no collections allowed.
    #[serde(default)]
    pub collection_scopes: Vec<String>,
    /// Optional user-id (for audit).
    #[serde(default)]
    pub user_id: Option<String>,
}

/// Token validator trait.
pub trait TokenValidator: Send + Sync {
    fn validate(&self, token: &str) -> AuthResult<Claims>;
    fn has_scope(&self, claims: &Claims, collection: &str) -> bool {
        claims.collection_scopes.iter().any(|s| s == collection)
    }
}

/// JWT validator. Supports both HS256 (shared secret) and RS256 (asymmetric).
///
/// `JwtValidator::new(secret)` returns an HS256 validator.
/// `JwtValidator::with_rsa_public_key(pem)` returns an RS256 validator.
pub struct JwtValidator {
    inner: JwtKey,
    /// Optional clock skew tolerance in seconds (default 60).
    leeway: u64,
}

enum JwtKey {
    /// HS256 shared secret.
    Hmac(Vec<u8>),
    /// RS256 public key in PEM format.
    RsaPublicPem(Vec<u8>),
}

impl JwtValidator {
    /// HS256 validator with a shared secret.
    pub fn new(secret: impl Into<Vec<u8>>) -> Self {
        Self {
            inner: JwtKey::Hmac(secret.into()),
            leeway: 60,
        }
    }

    /// RS256 validator with a public key in PEM format.
    pub fn with_rsa_public_key(pem: impl Into<Vec<u8>>) -> Self {
        Self {
            inner: JwtKey::RsaPublicPem(pem.into()),
            leeway: 60,
        }
    }

    pub fn with_leeway(mut self, seconds: u64) -> Self {
        self.leeway = seconds;
        self
    }
}

impl TokenValidator for JwtValidator {
    fn validate(&self, token: &str) -> AuthResult<Claims> {
        use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode};
        let (key, alg) = match &self.inner {
            JwtKey::Hmac(secret) => (DecodingKey::from_secret(secret), Algorithm::HS256),
            JwtKey::RsaPublicPem(pem) => {
                let key = DecodingKey::from_rsa_pem(pem)
                    .map_err(|e| AuthError::Invalid(format!("rsa pem: {}", e)))?;
                (key, Algorithm::RS256)
            }
        };
        let mut v = Validation::new(alg);
        v.leeway = self.leeway;
        let data = decode::<JwtClaims>(token, &key, &v).map_err(|e| match e.kind() {
            jsonwebtoken::errors::ErrorKind::ExpiredSignature => AuthError::Expired,
            _ => AuthError::Invalid(e.to_string()),
        })?;
        let jc = data.claims;
        let device_id = DeviceId(uuid::Uuid::parse_str(&jc.sub).map_err(|e| AuthError::Invalid(e.to_string()))?);
        Ok(Claims {
            device_id,
            exp: jc.exp,
            iat: jc.iat.unwrap_or(0),
            collection_scopes: jc.collection_scopes.unwrap_or_default(),
            user_id: jc.user_id,
        })
    }
}

/// Internal claims struct for JWT decoding (string-typed device_id, optional iat/user_id).
#[derive(Debug, Serialize, Deserialize)]
struct JwtClaims {
    sub: String,
    exp: i64,
    #[serde(default)]
    iat: Option<i64>,
    #[serde(default)]
    collection_scopes: Option<Vec<String>>,
    #[serde(default)]
    user_id: Option<String>,
}

/// In-memory API key validator.
pub struct ApiKeyValidator {
    keys: parking_lot::RwLock<std::collections::HashMap<String, Claims>>,
}

impl ApiKeyValidator {
    pub fn new() -> Self {
        Self { keys: parking_lot::RwLock::new(std::collections::HashMap::new()) }
    }
    pub fn add(&self, key: impl Into<String>, claims: Claims) {
        self.keys.write().insert(key.into(), claims);
    }
    pub fn remove(&self, key: &str) {
        self.keys.write().remove(key);
    }
    pub fn from_iter<I: IntoIterator<Item = (String, Claims)>>(iter: I) -> Self {
        let v = Self::new();
        for (k, c) in iter {
            v.add(k, c);
        }
        v
    }
}

impl Default for ApiKeyValidator {
    fn default() -> Self {
        Self::new()
    }
}

impl TokenValidator for ApiKeyValidator {
    fn validate(&self, token: &str) -> AuthResult<Claims> {
        self.keys
            .read()
            .get(token)
            .cloned()
            .ok_or_else(|| AuthError::Invalid("unknown api key".into()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use jsonwebtoken::{Algorithm, EncodingKey, Header, encode};

    fn make_jwt(secret: &[u8], claims: &JwtClaims) -> String {
        encode(&Header::new(Algorithm::HS256), claims, &EncodingKey::from_secret(secret)).unwrap()
    }

    #[test]
    fn jwt_round_trip() {
        let secret = b"super-secret-test-key";
        let d = DeviceId::new();
        let jc = JwtClaims {
            sub: d.to_string(),
            exp: (chrono_now() + 3600),
            iat: Some(chrono_now()),
            collection_scopes: Some(vec!["users".into(), "orders".into()]),
            user_id: Some("u1".into()),
        };
        let token = make_jwt(secret, &jc);
        let v = JwtValidator::new(secret);
        let claims = v.validate(&token).unwrap();
        assert_eq!(claims.device_id, d);
        assert_eq!(claims.collection_scopes, vec!["users", "orders"]);
        assert!(v.has_scope(&claims, "users"));
        assert!(!v.has_scope(&claims, "admin"));
    }

    #[test]
    fn jwt_expired_rejected() {
        let secret = b"secret";
        let d = DeviceId::new();
        let jc = JwtClaims {
            sub: d.to_string(),
            exp: chrono_now() - 3600, // expired
            iat: None,
            collection_scopes: None,
            user_id: None,
        };
        let token = make_jwt(secret, &jc);
        let v = JwtValidator::new(secret);
        match v.validate(&token) {
            Err(AuthError::Expired) => {}
            other => panic!("expected Expired, got {:?}", other),
        }
    }

    #[test]
    fn jwt_bad_signature_rejected() {
        let d = DeviceId::new();
        let jc = JwtClaims {
            sub: d.to_string(),
            exp: chrono_now() + 3600,
            iat: None,
            collection_scopes: None,
            user_id: None,
        };
        let token = make_jwt(b"key-a", &jc);
        let v = JwtValidator::new(b"key-b");
        assert!(matches!(v.validate(&token), Err(AuthError::Invalid(_))));
    }

    #[test]
    fn api_key_validator() {
        let d = DeviceId::new();
        let claims = Claims {
            device_id: d,
            exp: 0,
            iat: 0,
            collection_scopes: vec!["x".into()],
            user_id: None,
        };
        let v = ApiKeyValidator::new();
        v.add("key-1", claims.clone());
        let got = v.validate("key-1").unwrap();
        assert_eq!(got.device_id, d);
        assert!(v.validate("key-2").is_err());
    }

    #[test]
    fn rs256_round_trip() {
        use jsonwebtoken::{Algorithm, EncodingKey, Header, encode};
        use rsa::pkcs8::{EncodePrivateKey, EncodePublicKey, LineEnding};
        use rsa::traits::PublicKeyParts;
        use rsa::{RsaPrivateKey, RsaPublicKey};

        // Generate a fresh 2048-bit RSA key pair.
        let mut rng = rand::thread_rng();
        let priv_key = RsaPrivateKey::new(&mut rng, 2048).unwrap();
        let pub_key = RsaPublicKey::from(&priv_key);

        // PEM-encode the keys.
        let priv_pem = priv_key.to_pkcs8_pem(LineEnding::LF).unwrap();
        let pub_pem = pub_key.to_public_key_pem(LineEnding::LF).unwrap();
        let _ = priv_key.size();

        // Sign a JWT with the private key.
        let d = DeviceId::new();
        let jc = JwtClaims {
            sub: d.to_string(),
            exp: chrono_now() + 3600,
            iat: Some(chrono_now()),
            collection_scopes: Some(vec!["orders".into()]),
            user_id: Some("u42".into()),
        };
        let token = encode(
            &Header::new(Algorithm::RS256),
            &jc,
            &EncodingKey::from_rsa_pem(priv_pem.as_bytes()).unwrap(),
        )
        .unwrap();

        // Validate with the public key.
        let v = JwtValidator::with_rsa_public_key(pub_pem.as_bytes());
        let claims = v.validate(&token).unwrap();
        assert_eq!(claims.device_id, d);
        assert_eq!(claims.collection_scopes, vec!["orders"]);
        assert_eq!(claims.user_id.as_deref(), Some("u42"));

        // Wrong public key → reject.
        let other_priv = RsaPrivateKey::new(&mut rng, 2048).unwrap();
        let other_pub = RsaPublicKey::from(&other_priv);
        let other_pem = other_pub.to_public_key_pem(LineEnding::LF).unwrap();
        let v2 = JwtValidator::with_rsa_public_key(other_pem.as_bytes());
        assert!(matches!(v2.validate(&token), Err(AuthError::Invalid(_))));
    }

    fn chrono_now() -> i64 {
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64
    }
}
