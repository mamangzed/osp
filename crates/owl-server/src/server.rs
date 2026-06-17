//! Server entry: compose storage + auth + router, run accept loop.

use crate::config::Config;
use crate::connection::accept_loop;
use crate::session::Router;
use crate::snapshot_task;
use anyhow::Context;
use owl_auth::JwtValidator;
use owl_storage::SqliteBackend;
use std::sync::Arc;
use std::time::Duration;
use tokio::net::TcpListener;
use tracing::info;

#[cfg(feature = "websocket")]
use owl_transport::accept_websocket;

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
    info!(bind = %cfg.bind, db = %cfg.db, "owl-server TCP listening");

    #[cfg(feature = "websocket")]
    let ws_listener = if let Some(ws_bind) = &cfg.ws_bind {
        let ws_listener = TcpListener::bind(ws_bind).await.context("bind ws")?;
        info!(ws_bind = %ws_bind, "owl-server WebSocket listening");
        Some(ws_listener)
    } else {
        None
    };

    // Snapshot scheduler. Period is fixed at 1 second; cadence is governed by
    // op count (`snapshot_every`).
    let _snap_handle = snapshot_task::spawn(
        router.clone(),
        records.clone(),
        oplog.clone(),
        snapshots.clone(),
        cfg.snapshot_every,
        Duration::from_secs(1),
    );

    // Spawn WebSocket accept loop if enabled
    #[cfg(feature = "websocket")]
    if let Some(ws_listener) = ws_listener {
        let router_ws = router.clone();
        let records_ws = records.clone();
        let oplog_ws = oplog.clone();
        let snapshots_ws = snapshots.clone();
        let validator_ws = validator.clone();
        let cfg_ws = cfg.clone();
        tokio::spawn(async move {
            if let Err(e) = accept_ws_loop(
                ws_listener,
                router_ws,
                records_ws,
                oplog_ws,
                snapshots_ws,
                validator_ws,
                &cfg_ws,
            ).await {
                tracing::error!("WebSocket accept loop error: {}", e);
            }
        });
    }

    accept_loop(listener, router, records, oplog, snapshots, validator, &cfg).await
}

#[cfg(feature = "websocket")]
async fn accept_ws_loop(
    listener: TcpListener,
    router: Arc<crate::session::Router>,
    records: Arc<dyn owl_storage::RecordStore>,
    oplog: Arc<dyn owl_storage::OpLogStore>,
    snapshots: Arc<dyn owl_storage::SnapshotStore>,
    validator: Arc<dyn owl_auth::TokenValidator>,
    cfg: &crate::config::Config,
) -> anyhow::Result<()> {
    use crate::connection::ConnectionHandler;
    use crate::session::Session;

    loop {
        let (stream, addr) = listener.accept().await?;
        let router = router.clone();
        let records = records.clone();
        let oplog = oplog.clone();
        let snapshots = snapshots.clone();
        let validator = validator.clone();
        let cfg = cfg.clone();

        tokio::spawn(async move {
            match accept_websocket(stream).await {
                Ok(conn) => {
                    let (session, rx) = Session::new(
                        uuid::Uuid::new_v4(),
                        owl_types::DeviceId::new(),
                        owl_auth::Claims {
                            device_id: owl_types::DeviceId::new(),
                            exp: 0,
                            iat: 0,
                            collection_scopes: vec![],
                            user_id: None,
                        },
                    );
                    let handler = ConnectionHandler {
                        conn,
                        session,
                        server_id: format!("owl-server-{}", &uuid::Uuid::new_v4().to_string()[..8]),
                        heartbeat_interval_ms: cfg.heartbeat_ms as u32,
                        snapshot_window: cfg.snapshot_every,
                        capabilities: vec![],
                        router,
                        records,
                        oplog,
                        snapshots,
                        validator,
                        rx,
                        on_op: None,
                    };
                    info!(%addr, "new WebSocket connection");
                    if let Err(e) = handler.run().await {
                        tracing::warn!("WebSocket connection error: {}", e);
                    }
                }
                Err(e) => {
                    tracing::debug!("WebSocket handshake failed from {}: {}", addr, e);
                }
            }
        });
    }
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
