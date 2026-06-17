//! OWL CLI.

use clap::{Parser, Subcommand};
use owl_client::OwlClientBuilder;
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
        /// Server URL (tcp:// or tls://)
        #[arg(long, default_value = "tcp://127.0.0.1:9420")]
        url: String,
        /// Auth token
        #[arg(long)]
        token: String,
        /// TLS: path to a PEM file with CA certificates to trust. Used only
        /// when `--url` is `tls://...`.
        #[arg(long, value_name = "PEM_FILE")]
        tls_roots: Option<std::path::PathBuf>,
        /// TLS: server name for SNI + cert verification. Defaults to the
        /// host portion of the URL.
        #[arg(long)]
        tls_server_name: Option<String>,
        #[command(subcommand)]
        cmd: ClientCmd,
    },
    /// Generate multi-language stubs from .proto files (Stage 10).
    Codegen {
        /// Comma-separated languages: rust,dart,node,python,php,go
        #[arg(long, default_value = "rust")]
        lang: String,
        /// Output directory (one subdir per language)
        #[arg(long, default_value = "bindings/generated")]
        out: std::path::PathBuf,
        /// One or more .proto entry-point files (defaults to all under proto/osp/v1/)
        #[arg(long)]
        proto: Vec<std::path::PathBuf>,
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
    // Codegen is synchronous, handle outside the async runtime.
    if let Cmd::Codegen { lang, out, proto } = &cli.cmd {
        return run_codegen(lang, out, proto);
    }
    match cli.cmd {
        Cmd::Server { bind, db, jwt_secret } => {
            let cfg = ServerConfig {
                bind,
                db,
                jwt_secret,
                ws_bind: None,
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
        Cmd::Client { url, token, tls_roots, tls_server_name, cmd } => {
            let mut builder = OwlClientBuilder::new()
                .url(&url)
                .token(&token)
                .local_db(format!("owl-cli-{}.db", uuid::Uuid::new_v4()));
            if let Some(path) = tls_roots {
                let pem = std::fs::read(&path)
                    .map_err(|e| anyhow::anyhow!("read tls roots {}: {}", path.display(), e))?;
                builder = builder.tls_roots_pem(pem);
            }
            if let Some(name) = tls_server_name {
                builder = builder.tls_server_name(name);
            }
            let client = builder.build()?;
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
        Cmd::Codegen { .. } => {
            // Handled above by the early return.
            unreachable!()
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

fn run_codegen(lang: &str, out: &std::path::Path, protos: &[std::path::PathBuf]) -> anyhow::Result<()> {
    let langs: Vec<owl_codegen::Lang> = lang
        .split(',')
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .map(|s| owl_codegen::Lang::parse(s).ok_or_else(|| anyhow::anyhow!("unknown language: {}", s)))
        .collect::<anyhow::Result<_>>()?;
    if langs.is_empty() {
        anyhow::bail!("no languages selected");
    }
    // Resolve protos: defaults to all four under proto/osp/v1/ at the workspace root.
    let resolved_protos: Vec<std::path::PathBuf> = if protos.is_empty() {
        // Walk up from current_exe to find the workspace root (Cargo.toml + proto/).
        let mut p = std::env::current_exe()?;
        let found = (0..8).find_map(|_| {
            if p.pop() && p.join("Cargo.toml").exists() && p.join("proto").exists() {
                Some(p.clone())
            } else { None }
        });
        let root = found.ok_or_else(|| anyhow::anyhow!("workspace root not found"))?;
        ["frame.proto", "auth.proto", "common.proto", "sync.proto"]
            .iter()
            .map(|n| root.join("proto").join("osp").join("v1").join(n))
            .filter(|p| p.exists())
            .collect()
    } else {
        protos.to_vec()
    };
    if resolved_protos.is_empty() {
        anyhow::bail!("no .proto files found");
    }
    let first = resolved_protos.first().unwrap();
    let mut include = first.clone();
    include.pop(); // frame.proto
    include.pop(); // v1
    include.pop(); // osp
    let protos_canon: Vec<_> = resolved_protos.into_iter()
        .map(|p| p.canonicalize().unwrap_or(p))
        .collect();
    let include_canon = include.canonicalize().unwrap_or(include);
    eprintln!("owl codegen: emitting {:?} to {}", langs, out.display());
    owl_codegen::generate(&langs, &protos_canon, &include_canon, out)?;
    Ok(())
}
