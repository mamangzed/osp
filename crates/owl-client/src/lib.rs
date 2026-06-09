//! owl-client: high-level OSP client SDK.

#![forbid(unsafe_code)]

pub mod config;
pub mod connection;
pub mod state;
pub mod sync_task;

use crate::config::ClientConfig;
use crate::connection::{ActiveConnection, ConnectionManager};
use crate::state::ClientState;
use owl_protocol::{OperationMsg, Predicate, Value};
use owl_storage::SqliteBackend;
use owl_sync::SyncEngine;
use owl_types::{CollectionId, DeviceId, Lamport, RecordId};
use std::sync::Arc;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ClientError {
    #[error("not connected")]
    NotConnected,
    #[error("io: {0}")]
    Io(String),
    #[error("storage: {0}")]
    Storage(#[from] owl_storage::StorageError),
    #[error("sync: {0}")]
    Sync(#[from] owl_sync::SyncError),
    #[error("connect: {0}")]
    Connect(#[from] crate::connection::ConnectError),
    #[error("invalid uuid: {0}")]
    InvalidUuid(#[from] uuid::Error),
    #[error("config: {0}")]
    Config(String),
}

pub type ClientResult<T> = std::result::Result<T, ClientError>;

/// High-level OSP client.
pub struct OwlClient {
    pub cfg: ClientConfig,
    pub state: Arc<ClientState>,
    pub engine: Arc<SyncEngine>,
    pub active: parking_lot::Mutex<Option<Arc<ActiveConnection>>>,
    pub sync_handle: parking_lot::Mutex<Option<tokio::task::JoinHandle<()>>>,
}

impl OwlClient {
    pub fn new(cfg: ClientConfig) -> ClientResult<Self> {
        if cfg.url.is_empty() {
            return Err(ClientError::Config("url is required".into()));
        }
        let device = cfg.device_id.unwrap_or_default();

        // Build storage (SQLite if path given, else in-memory)
        let store: Arc<SqliteBackend> = if let Some(path) = &cfg.local_db {
            Arc::new(SqliteBackend::open(path)?)
        } else {
            Arc::new(SqliteBackend::open_in_memory()?)
        };
        let records: Arc<dyn owl_storage::RecordStore> = store.clone();
        let oplog: Arc<dyn owl_storage::OpLogStore> = store.clone();
        let snapshots: Arc<dyn owl_storage::SnapshotStore> = store;

        let engine = Arc::new(SyncEngine::new(device, records, oplog, snapshots));
        let state = ClientState::from_engine(engine.clone());
        Ok(Self {
            cfg,
            state,
            engine,
            active: parking_lot::Mutex::new(None),
            sync_handle: parking_lot::Mutex::new(None),
        })
    }

    /// Open connection, run HELLO + AUTH, start background sync loop.
    pub async fn connect(&self) -> ClientResult<()> {
        let mgr = ConnectionManager::new(self.state.clone(), self.cfg.clone());
        let active = mgr.connect_with_retry().await?;
        let handle = crate::sync_task::spawn_sync_loop(active.clone(), self.state.clone(), self.engine.clone());
        *self.active.lock() = Some(active);
        *self.sync_handle.lock() = Some(handle);
        Ok(())
    }

    pub fn is_connected(&self) -> bool {
        self.active.lock().is_some()
    }

    /// Disconnect and stop the sync loop.
    pub fn disconnect(&self) {
        if let Some(h) = self.sync_handle.lock().take() {
            h.abort();
        }
        *self.active.lock() = None;
    }

    /// Set a field on a record. Generates an op, applies locally, pushes to server.
    pub async fn set(&self, coll: &str, id: &str, field: &str, value: Value) -> ClientResult<OperationMsg> {
        let op = self.engine.local_set_field(
            CollectionId::new(coll),
            RecordId::new(id),
            field,
            value,
        ).await?;
        if let Some(active) = self.active.lock().as_ref() {
            crate::sync_task::push_op(active, &self.state, op.clone()).await
                .map_err(ClientError::Io)?;
        }
        Ok(op)
    }

    /// Delete a record (tombstone).
    pub async fn delete(&self, coll: &str, id: &str) -> ClientResult<OperationMsg> {
        let op = self.engine.local_delete(CollectionId::new(coll), RecordId::new(id)).await?;
        if let Some(active) = self.active.lock().as_ref() {
            crate::sync_task::push_op(active, &self.state, op.clone()).await
                .map_err(ClientError::Io)?;
        }
        Ok(op)
    }

    /// Restore a tombstoned record.
    pub async fn restore(&self, coll: &str, id: &str) -> ClientResult<OperationMsg> {
        let op = self.engine.local_restore(CollectionId::new(coll), RecordId::new(id)).await?;
        if let Some(active) = self.active.lock().as_ref() {
            crate::sync_task::push_op(active, &self.state, op.clone()).await
                .map_err(ClientError::Io)?;
        }
        Ok(op)
    }

    /// Get a record from local cache.
    pub async fn get(&self, coll: &str, id: &str) -> ClientResult<Option<owl_protocol::RecordMsg>> {
        Ok(self.engine.get_record(&CollectionId::new(coll), &RecordId::new(id)).await?)
    }

    /// Subscribe to a collection.
    pub async fn subscribe(&self, coll: &str, predicate: Option<Predicate>, with_snapshot: bool) -> ClientResult<String> {
        let active = self.active.lock().as_ref().cloned().ok_or(ClientError::NotConnected)?;
        crate::sync_task::subscribe(&active, &self.state, coll, predicate, with_snapshot).await
            .map_err(ClientError::Io)
    }

    /// Request a sync delta since a given lamport.
    pub async fn sync_since(&self, coll: &str, since: Lamport) -> ClientResult<()> {
        let active = self.active.lock().as_ref().cloned().ok_or(ClientError::NotConnected)?;
        crate::sync_task::request_delta(&active, coll, since).await
            .map_err(ClientError::Io)
    }

    /// Apply a snapshot received from server.
    pub async fn apply_snapshot(&self, snap: owl_protocol::SnapshotMsg) -> ClientResult<()> {
        Ok(self.engine.apply_snapshot(snap).await?)
    }
}

impl Drop for OwlClient {
    fn drop(&mut self) {
        self.disconnect();
    }
}

/// Builder for `OwlClient`.
pub struct OwlClientBuilder {
    cfg: ClientConfig,
}

impl OwlClientBuilder {
    pub fn new() -> Self {
        Self { cfg: ClientConfig::default() }
    }
    pub fn url(mut self, url: impl Into<String>) -> Self { self.cfg.url = url.into(); self }
    pub fn token(mut self, token: impl Into<String>) -> Self { self.cfg.token = token.into(); self }
    pub fn device_id(mut self, id: DeviceId) -> Self { self.cfg.device_id = Some(id); self }
    pub fn local_db(mut self, path: impl Into<String>) -> Self { self.cfg.local_db = Some(path.into()); self }
    pub fn heartbeat_interval(mut self, d: std::time::Duration) -> Self { self.cfg.heartbeat_interval = d; self }
    pub fn reconnect_max_attempts(mut self, n: u32) -> Self { self.cfg.reconnect_max_attempts = Some(n); self }
    /// Override the entire TLS client config (used when the URL is `tls://`).
    pub fn tls(mut self, tls: crate::config::TlsClientConfig) -> Self { self.cfg.tls = tls; self }
    /// Convenience: PEM-encoded CA certificates to trust for `tls://` URLs.
    pub fn tls_roots_pem(mut self, pem: impl Into<Vec<u8>>) -> Self {
        self.cfg.tls.roots_pem = Some(pem.into());
        self
    }
    /// Convenience: explicit server name for SNI / cert verification.
    pub fn tls_server_name(mut self, name: impl Into<String>) -> Self {
        self.cfg.tls.server_name = Some(name.into());
        self
    }
    pub fn build(self) -> ClientResult<OwlClient> {
        OwlClient::new(self.cfg)
    }
}

impl Default for OwlClientBuilder {
    fn default() -> Self { Self::new() }
}
