//! Storage traits. Three orthogonal stores: records, op log, snapshots.

use async_trait::async_trait;
use owl_protocol::{FieldMetaMsg, OperationMsg, RecordMsg, SnapshotMsg, Value};
use owl_types::{CollectionId, Lamport, OpId, RecordId};
use std::collections::BTreeMap;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum StorageError {
    #[error("not found: {0}")]
    NotFound(String),
    #[error("io: {0}")]
    Io(String),
    #[error("serde: {0}")]
    Serde(String),
    #[error("sqlite: {0}")]
    Sqlite(String),
    #[error("other: {0}")]
    Other(String),
}

pub type StorageResult<T> = std::result::Result<T, StorageError>;

/// Filter for `list_collection`. Mirrors owl-query semantics.
#[derive(Debug, Clone, Default)]
pub struct ListFilter {
    pub tombstoned: Option<bool>,
    pub limit: Option<u32>,
    pub after: Option<RecordId>,
    pub order_by: Option<String>,
    pub descending: bool,
}

/// Store for current record state.
#[async_trait]
pub trait RecordStore: Send + Sync {
    async fn put_record(&self, coll: &CollectionId, rec: &RecordMsg) -> StorageResult<()>;
    async fn get_record(&self, coll: &CollectionId, id: &RecordId) -> StorageResult<Option<RecordMsg>>;
    async fn delete_record(&self, coll: &CollectionId, id: &RecordId) -> StorageResult<()>;
    async fn list_collection(&self, coll: &CollectionId, filter: &ListFilter) -> StorageResult<Vec<RecordMsg>>;
    async fn count_collection(&self, coll: &CollectionId, include_tombstoned: bool) -> StorageResult<u64>;
}

/// Store for the operation log (idempotent append, time-ordered replay).
#[async_trait]
pub trait OpLogStore: Send + Sync {
    async fn append_op(&self, op: &OperationMsg) -> StorageResult<()>;
    async fn has_op(&self, op_id: &OpId) -> StorageResult<bool>;
    async fn op_log_since(&self, coll: &CollectionId, since: Lamport) -> StorageResult<Vec<OperationMsg>>;
    async fn latest_lamport(&self, coll: &CollectionId) -> StorageResult<Option<Lamport>>;
    async fn trim_before(&self, coll: &CollectionId, lamport: Lamport) -> StorageResult<u64>;
}

/// Store for collection snapshots.
#[async_trait]
pub trait SnapshotStore: Send + Sync {
    async fn save_snapshot(&self, coll: &CollectionId, snap: &SnapshotMsg) -> StorageResult<()>;
    async fn load_snapshot(&self, coll: &CollectionId, revision: u64) -> StorageResult<Option<SnapshotMsg>>;
    async fn latest_snapshot(&self, coll: &CollectionId) -> StorageResult<Option<SnapshotMsg>>;
    async fn trim_snapshots(&self, coll: &CollectionId, keep: u32) -> StorageResult<u64>;
}

/// Re-exported types for convenience.
pub use owl_protocol::RecordMsg as Record;
pub use owl_protocol::OperationMsg as Operation;

pub fn empty_field_meta() -> BTreeMap<String, FieldMetaMsg> {
    BTreeMap::new()
}

pub fn value_to_string(v: &Value) -> String {
    match v {
        Value::Null => "null".to_string(),
        Value::Bool(b) => b.to_string(),
        Value::Int(i) => i.to_string(),
        Value::Double(d) => d.to_string(),
        Value::String(s) => s.clone(),
        Value::Bytes(b) => format!("bytes:{}:{}", b.len(), hex::encode_short(b)),
        Value::Array(_) => "[array]".to_string(),
        Value::Object(_) => "{object}".to_string(),
    }
}

// Stub hex helper to avoid adding a dep.
mod hex {
    pub fn encode_short(b: &[u8]) -> String {
        if b.len() <= 8 {
            b.iter().map(|x| format!("{:02x}", x)).collect()
        } else {
            let head: String = b[..4].iter().map(|x| format!("{:02x}", x)).collect();
            let tail: String = b[b.len() - 4..].iter().map(|x| format!("{:02x}", x)).collect();
            format!("{}..{}", head, tail)
        }
    }
}
