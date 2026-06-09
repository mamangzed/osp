//! OWL CLI.

use clap::{Parser, Subcommand};
use owl_auth::JwtValidator;
use owl_client::{OwlClient, OwlClientBuilder};
use owl_types::DeviceId;
use owl_server::config::Config as ServerConfig;
use serde_json::Value as JsonValue;
use std::time::Duration;

#[derive(Debug, Parser)]
#[command(name = "owl", version, about = "OWL sync operator CLI")]
struct Cli {
    #[command(subcommand)]
    cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    /// Run the OWL server.
    Server {
        /// TCP bind address
        #[arg(long, default_value = "0.0.0.0:9420")]
        bind: String,
        /// SQLite database path (use :memory: for in-memory)
        #[arg(long, default_value = "owl.db")]
        db: String,
        /// JWT shared secret (HS256). If omitted, dev-mode accepts any non-empty token.
        #[arg(long)]
        jwt_secret: Option<String>,
    },
    /// Issue a JWT for a device (debug/development only).
    IssueToken {
        /// Device id (UUID). Auto-generated if omitted.
        #[arg(long)]
        device: Option<String>,
        /// JWT shared secret
        #[arg(long)]
        secret: String,
        /// Comma-separated collection scopes (e.g. "users,orders"). Use "*" for all.
        #[arg(long, default_value = "*")]
        scopes: String,
        /// Expiration in seconds from now (default 1 day)
        #[arg(long, default_value_t = 86400)]
        ttl: i64,
    },
    /// Client commands.
    Client {
        /// Server URL
        #[arg(long, default_value = "tcp://127.0.0.1:9420")]
        url: String,
        /// Auth token
        #[arg(long)]
        token: String,
        #[command(subcommand)]
        cmd: ClientCmd,
    },
}

#[derive(Debug, Subcommand)]
enum ClientCmd {
    /// Set a field on a record.
    Set {
        collection: String,
        id: String,
        field: String,
        /// JSON value: "42", "\"text\"", "true", "null", "[1,2]", "{\"k\":\"v\"}"
        value: String,
    },
    /// Get a record.
    Get {
        collection: String,
        id: String,
    },
    /// Delete (tombstone) a record.
    Delete {
        collection: String,
        id: String,
    },
    /// Restore a tombstoned record.
    Restore {
        collection: String,
        id: String,
    },
    /// Subscribe (prints server's snapshot to stdout as JSON lines).
    Subscribe {
        collection: String,
    },
}

#[tokio::main(flavor = "multi_thread")]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();
    match cli.cmd {
        Cmd::Server { bind, db, jwt_secret } => {
            let cfg = ServerConfig {
                bind,
                db,
                jwt_secret,
                heartbeat_ms: 15000,
                snapshot_every: 1000,
                max_connections: 1024,
            };
            owl_server::server::run(cfg).await?;
        }
        Cmd::IssueToken { device, secret, scopes, ttl } => {
            let device_id = match device {
                Some(s) => DeviceId(uuid::Uuid::parse_str(&s)?),
                None => DeviceId::new(),
            };
            let now = chrono::Utc::now().timestamp();
            let exp = now + ttl;
            let claims = owl_auth::Claims {
                device_id,
                exp,
                iat: now,
                collection_scopes: scopes.split(',').map(|s| s.trim().to_string()).collect(),
                user_id: None,
            };
            // Sign using jsonwebtoken directly
            use jsonwebtoken::{Algorithm, EncodingKey, Header, encode};
            #[derive(serde::Serialize)]
            struct C<'a> {
                sub: String,
                exp: i64,
                iat: i64,
                collection_scopes: &'a [String],
            }
            let c = C {
                sub: device_id.to_string(),
                exp,
                iat: now,
                collection_scopes: &claims.collection_scopes,
            };
            let token = encode(&Header::new(Algorithm::HS256), &c, &EncodingKey::from_secret(secret.as_bytes()))?;
            println!("{}", token);
        }
        Cmd::Client { url, token, cmd } => {
            let client = OwlClientBuilder::new()
                .url(&url)
                .token(&token)
                .local_db(format!("owl-cli-{}.db", uuid::Uuid::new_v4()))
                .build()?;
            client.connect().await?;
            match cmd {
                ClientCmd::Set { collection, id, field, value } => {
                    let v = parse_json(&value)?;
                    let op = client.set(&collection, &id, &field, v).await?;
                    println!("{}", serde_json::to_string(&op)?);
                }
                ClientCmd::Get { collection, id } => {
                    let rec = client.get(&collection, &id).await?;
                    match rec {
                        Some(r) => {
                            let mut obj = serde_json::Map::new();
                            for (k, v) in r.fields {
                                obj.insert(k, value_to_json(&v));
                            }
                            let out = serde_json::json!({
                                "collection": r.collection,
                                "record_id": r.record_id,
                                "revision": r.revision,
                                "tombstone": r.tombstone,
                                "fields": obj,
                            });
                            println!("{}", serde_json::to_string_pretty(&out)?);
                        }
                        None => println!("null"),
                    }
                }
                ClientCmd::Delete { collection, id } => {
                    let op = client.delete(&collection, &id).await?;
                    println!("{}", serde_json::to_string(&op)?);
                }
                ClientCmd::Restore { collection, id } => {
                    let op = client.restore(&collection, &id).await?;
                    println!("{}", serde_json::to_string(&op)?);
                }
                ClientCmd::Subscribe { collection } => {
                    let _ = client.subscribe(&collection, None, true).await?;
                    println!("subscribed to {}", collection);
                    // Just block; in v1, a real event stream is a follow-up.
                    tokio::time::sleep(Duration::from_secs(1)).await;
                }
            }
            client.disconnect();
        }
    }
    Ok(())
}

fn parse_json(s: &str) -> anyhow::Result<owl_protocol::Value> {
    let v: JsonValue = serde_json::from_str(s)?;
    Ok(json_to_value(v))
}

fn json_to_value(v: JsonValue) -> owl_protocol::Value {
    match v {
        JsonValue::Null => owl_protocol::Value::Null,
        JsonValue::Bool(b) => owl_protocol::Value::Bool(b),
        JsonValue::Number(n) => {
            if let Some(i) = n.as_i64() {
                owl_protocol::Value::Int(i)
            } else if let Some(f) = n.as_f64() {
                owl_protocol::Value::Double(f)
            } else {
                owl_protocol::Value::Null
            }
        }
        JsonValue::String(s) => owl_protocol::Value::String(s),
        JsonValue::Array(items) => owl_protocol::Value::Array(items.into_iter().map(json_to_value).collect()),
        JsonValue::Object(map) => {
            let mut out = std::collections::BTreeMap::new();
            for (k, v) in map {
                out.insert(k, json_to_value(v));
            }
            owl_protocol::Value::Object(out)
        }
    }
}

fn value_to_json(v: &owl_protocol::Value) -> JsonValue {
    match v {
        owl_protocol::Value::Null => JsonValue::Null,
        owl_protocol::Value::Bool(b) => JsonValue::Bool(*b),
        owl_protocol::Value::Int(i) => JsonValue::Number((*i).into()),
        owl_protocol::Value::Double(f) => serde_json::Number::from_f64(*f).map(JsonValue::Number).unwrap_or(JsonValue::Null),
        owl_protocol::Value::String(s) => JsonValue::String(s.clone()),
        owl_protocol::Value::Bytes(b) => JsonValue::String(format!("<bytes:{}>", b.len())),
        owl_protocol::Value::Array(items) => JsonValue::Array(items.iter().map(value_to_json).collect()),
        owl_protocol::Value::Object(map) => {
            let mut out = serde_json::Map::new();
            for (k, v) in map {
                out.insert(k.clone(), value_to_json(v));
            }
            JsonValue::Object(out)
        }
    }
}
