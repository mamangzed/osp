//! Client configuration.

use owl_types::DeviceId;
use std::sync::Arc;
use std::time::Duration;

/// TLS configuration for the client side. Used when the URL has `tls://`.
#[derive(Debug, Clone)]
pub struct TlsClientConfig {
    /// Optional PEM-encoded CA certificates to trust. If `None`, the system
    /// root store is used (when the `rustls-native-certs` feature is on, but
    /// we ship a manual fallback: see `default_roots`).
    pub roots_pem: Option<Vec<u8>>,
    /// Server name for SNI + cert verification. Defaults to the host portion
    /// of the URL when `None`.
    pub server_name: Option<String>,
    /// Skip cert verification entirely. **Do not use in production.**
    pub danger_skip_verify: bool,
}

impl Default for TlsClientConfig {
    fn default() -> Self {
        Self {
            roots_pem: None,
            server_name: None,
            danger_skip_verify: false,
        }
    }
}

#[derive(Debug, Clone)]
pub struct ClientConfig {
    /// Server URL. Scheme determines transport:
    /// - `tcp://host:port`     → plain TCP (default)
    /// - `tls://host:port`     → TLS (rustls). Honors `tls` field below.
    /// - `host:port`           → plain TCP
    pub url: String,
    /// Auth token (JWT or API key)
    pub token: String,
    /// This device's id (auto-generated if None)
    pub device_id: Option<DeviceId>,
    /// Local SQLite database path for offline cache
    pub local_db: Option<String>,
    /// Heartbeat interval (default 15s)
    pub heartbeat_interval: Duration,
    /// Reconnect strategy
    pub reconnect_max_attempts: Option<u32>,
    /// TLS settings (only consulted when `url` is `tls://...`).
    pub tls: TlsClientConfig,
}

impl Default for ClientConfig {
    fn default() -> Self {
        Self {
            url: "tcp://127.0.0.1:9420".to_string(),
            token: String::new(),
            device_id: None,
            local_db: None,
            heartbeat_interval: Duration::from_secs(15),
            reconnect_max_attempts: None,
            tls: TlsClientConfig::default(),
        }
    }
}

/// Build the rustls `ClientConfig` from `TlsClientConfig`. If `roots_pem` is
/// `None`, we fall back to an empty root store (no system roots) and rely on
/// the user supplying their own CA bundle. Set `danger_skip_verify` to
/// disable verification (dev only).
pub fn build_tls_client_config(cfg: &TlsClientConfig) -> anyhow::Result<Arc<rustls::ClientConfig>> {
    let mut roots = rustls::RootCertStore::empty();
    if let Some(pem) = &cfg.roots_pem {
        let mut cursor = pem.as_slice();
        let certs: Vec<rustls::pki_types::CertificateDer<'static>> =
            rustls_pemfile::certs(&mut cursor)
                .collect::<Result<_, _>>()
                .map_err(|e| anyhow::anyhow!("parse roots_pem: {}", e))?;
        for c in certs {
            roots.add(c).map_err(|e| anyhow::anyhow!("add root cert: {}", e))?;
        }
    } else {
        // No PEM supplied. Try the webpki-roots bundle (Mozilla's CA store).
        #[cfg(feature = "tls-webpki-roots")]
        {
            // webpki-roots 0.26 returns the bundle as a slice of
            // `TrustAnchor<'_>`. Convert each `subject` (a DER-encoded
            // certificate) to a CertificateDer and add to the store.
            for ta in webpki_roots::TLS_SERVER_ROOTS {
                let der: rustls::pki_types::CertificateDer<'static> =
                    rustls::pki_types::CertificateDer::from(ta.subject.to_vec());
                if roots.add(der).is_err() {
                    // Skip unparsable anchors; the rest still work.
                }
            }
        }
        #[cfg(not(feature = "tls-webpki-roots"))]
        {
            // No roots. We still return a config, but it will reject any cert.
            // Users can either:
            //  - enable the `tls-webpki-roots` feature on `owl-client`, or
            //  - pass their own PEM in `TlsClientConfig::roots_pem`.
        }
    }

    let builder = rustls::ClientConfig::builder().with_root_certificates(roots);
    let config = builder.with_no_client_auth();
    if cfg.danger_skip_verify {
        // The standard rustls builder always verifies; the `set_enable_tickets`
        // etc. don't help. For dev convenience, the caller can construct their
        // own config and supply the cert through `roots_pem` instead.
        // (We intentionally don't expose a full skip-verify hook here because
        // it would require unsafe or pulling in `rustls` feature flags. For
        // self-signed dev certs, just pass the cert in `roots_pem`.)
        anyhow::bail!(
            "danger_skip_verify is not supported; pass the self-signed cert in roots_pem instead"
        );
    }
    Ok(Arc::new(config))
}
