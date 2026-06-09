//! Server entry: compose storage + auth + router, run accept loop.

use crate::config::Config;
use crate::connection::accept_loop;
use crate::session::Router;
use anyhow::Context;
use owl_auth::JwtValidator;
use owl_storage::SqliteBackend;
use std::sync::Arc;
use tokio::net::TcpListener;
use tracing::info;

pub async fn run(cfg: Config) -> anyhow::Result<()> {
    let _ = tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info,owl_server=debug")),
        )
        .try_init();

    // Storage: one SqliteBackend serves all three traits. Arc them at the
    // concrete level so we can lift to each trait type independently.
    let store = Arc::new(if cfg.db == ":memory:" {
        SqliteBackend::open_in_memory().context("open in-memory sqlite")?
    } else {
        SqliteBackend::open(&cfg.db).context("open sqlite")?
    });
    let records: Arc<dyn owl_storage::RecordStore> = store.clone();
    let oplog: Arc<dyn owl_storage::OpLogStore> = store.clone();
    let snapshots: Arc<dyn owl_storage::SnapshotStore> = store;

    // Auth
    let validator: Arc<dyn owl_auth::TokenValidator> = match &cfg.jwt_secret {
        Some(secret) => Arc::new(JwtValidator::new(secret.as_bytes())),
        None => {
            // Dev-mode: accept anything with non-empty token, all scopes
            Arc::new(DevAcceptAll)
        }
    };

    let router = Arc::new(Router::new());
    let listener = TcpListener::bind(&cfg.bind).await.context("bind")?;
    info!(bind = %cfg.bind, db = %cfg.db, "owl-server listening");

    accept_loop(listener, router, records, oplog, snapshots, validator, &cfg).await
}

/// Dev-only validator: accepts any non-empty token, grants all scopes.
pub struct DevAcceptAll;
impl owl_auth::TokenValidator for DevAcceptAll {
    fn validate(&self, token: &str) -> owl_auth::AuthResult<owl_auth::Claims> {
        if token.is_empty() {
            return Err(owl_auth::AuthError::Invalid("empty token".into()));
        }
        Ok(owl_auth::Claims {
            device_id: owl_types::DeviceId::new(),
            exp: i64::MAX,
            iat: 0,
            collection_scopes: vec!["*".into()],
            user_id: Some(token.to_string()),
        })
    }
    fn has_scope(&self, _claims: &owl_auth::Claims, _collection: &str) -> bool {
        true
    }
}
