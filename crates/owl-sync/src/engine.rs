//! SyncEngine: coordinates op generation, storage writes, and replay.

use crate::merge::{apply_op, MergeOutcome};
use crate::op::{build_delete, build_restore, build_update, make_field_change};
use owl_protocol::{OperationMsg, RecordMsg, SnapshotMsg, Value};
use owl_storage::{OpLogStore, RecordStore, SnapshotStore};
use owl_types::{CollectionId, DeviceId, Lamport, OpId, RecordId, VectorClock};
use std::collections::HashMap;
use std::sync::Arc;
use thiserror::Error;
use uuid::Uuid;

#[derive(Debug, Error)]
pub enum SyncError {
    #[error("storage: {0}")]
    Storage(#[from] owl_storage::StorageError),
    #[error("op build: {0}")]
    OpBuild(String),
    #[error("merge: {0}")]
    Merge(#[from] crate::merge::MergeError),
    #[error("invalid uuid: {0}")]
    InvalidUuid(#[from] uuid::Error),
}

pub type SyncResult<T> = Result<T, SyncError>;

/// Per-collection local mutable state.
#[derive(Clone)]
struct LocalState {
    last_recv_lamport: Lamport,
    vector_clock: VectorClock,
    pending_ops: Vec<OperationMsg>,
}

impl LocalState {
    fn new() -> Self {
        Self {
            last_recv_lamport: Lamport::ZERO,
            vector_clock: VectorClock::new(),
            pending_ops: vec![],
        }
    }
}

pub struct SyncEngine {
    device: DeviceId,
    records: Arc<dyn RecordStore>,
    oplog: Arc<dyn OpLogStore>,
    snapshots: Arc<dyn SnapshotStore>,
    state: parking_lot::Mutex<HashMap<CollectionId, LocalState>>,
}

impl SyncEngine {
    pub fn new(
        device: DeviceId,
        records: Arc<dyn RecordStore>,
        oplog: Arc<dyn OpLogStore>,
        snapshots: Arc<dyn SnapshotStore>,
    ) -> Self {
        Self {
            device,
            records,
            oplog,
            snapshots,
            state: parking_lot::Mutex::new(HashMap::new()),
        }
    }

    pub fn device(&self) -> DeviceId {
        self.device
    }

    fn state_for(&self, coll: &CollectionId) -> LocalState {
        let mut g = self.state.lock();
        g.entry(coll.clone()).or_insert_with(LocalState::new).clone()
    }

    fn update_state<F: FnOnce(&mut LocalState)>(&self, coll: &CollectionId, f: F) {
        let mut g = self.state.lock();
        let s = g.entry(coll.clone()).or_insert_with(LocalState::new);
        f(s);
    }

    /// Bump local lamport to be greater than any seen.
    fn next_lamport(&self, coll: &CollectionId) -> Lamport {
        let mut g = self.state.lock();
        let s = g.entry(coll.clone()).or_insert_with(LocalState::new);
        s.last_recv_lamport = s.last_recv_lamport.bump();
        s.last_recv_lamport
    }

    /// Bump a specific device's clock entry (for incoming ops).
    fn observe_remote(&self, coll: &CollectionId, device: DeviceId, lamport: u64) {
        let mut g = self.state.lock();
        let s = g.entry(coll.clone()).or_insert_with(LocalState::new);
        s.last_recv_lamport = Lamport(s.last_recv_lamport.0.max(lamport));
        s.vector_clock.increment_to(device, lamport);
    }

    /// Local: update or insert record. Generates a field-level LWW op.
    /// If the record does not exist, this is an Insert; if it exists, Update.
    pub async fn local_set_field(
        &self,
        coll: CollectionId,
        record_id: RecordId,
        field: impl Into<String>,
        value: Value,
    ) -> SyncResult<OperationMsg> {
        let lamport = self.next_lamport(&coll);
        let base_clock = self.state_for(&coll).vector_clock.clone();
        let field = field.into();
        let fc = make_field_change(field, value, lamport, self.device);
        let op = build_update(self.device, coll.clone(), record_id, vec![fc], base_clock, lamport)
            .map_err(|e| SyncError::OpBuild(e.to_string()))?;
        self.apply_local(op.clone()).await?;
        Ok(op)
    }

    /// Local: delete a record (writes tombstone).
    pub async fn local_delete(
        &self,
        coll: CollectionId,
        record_id: RecordId,
    ) -> SyncResult<OperationMsg> {
        let lamport = self.next_lamport(&coll);
        let base_clock = self.state_for(&coll).vector_clock.clone();
        let op = build_delete(self.device, coll.clone(), record_id, base_clock, lamport);
        self.apply_local(op.clone()).await?;
        Ok(op)
    }

    /// Local: restore a tombstoned record.
    pub async fn local_restore(
        &self,
        coll: CollectionId,
        record_id: RecordId,
    ) -> SyncResult<OperationMsg> {
        let lamport = self.next_lamport(&coll);
        let base_clock = self.state_for(&coll).vector_clock.clone();
        let op = build_restore(self.device, coll.clone(), record_id, base_clock, lamport);
        self.apply_local(op.clone()).await?;
        Ok(op)
    }

    /// Apply a locally-generated op: persist, update storage, observe clock.
    pub async fn apply_local(&self, op: OperationMsg) -> SyncResult<MergeOutcome> {
        self.oplog.append_op(&op).await?;
        let coll = CollectionId::new(op.collection.clone());
        let rid = RecordId::new(op.record_id.clone());
        let current = self.records.get_record(&coll, &rid).await?;
        let (new, outcome) = apply_op(current.as_ref(), &op)?;
        if let Some(rec) = new {
            self.records.put_record(&coll, &rec).await?;
        }
        self.observe_remote(&coll, self.device, op.lamport);
        Ok(outcome)
    }

    /// Apply a remote op (from server, or replayed on reconnect).
    pub async fn apply_remote(&self, op: OperationMsg) -> SyncResult<MergeOutcome> {
        // Idempotency
        let op_uuid = OpId(Uuid::parse_str(&op.op_id)?);
        if self.oplog.has_op(&op_uuid).await? {
            // Already applied
            return Ok(MergeOutcome::NoOp);
        }
        self.oplog.append_op(&op).await?;
        let coll = CollectionId::new(op.collection.clone());
        let rid = RecordId::new(op.record_id.clone());
        let current = self.records.get_record(&coll, &rid).await?;
        let (new, outcome) = apply_op(current.as_ref(), &op)?;
        if let Some(rec) = new {
            self.records.put_record(&coll, &rec).await?;
        }
        let device = DeviceId(Uuid::parse_str(&op.device_id)?);
        self.observe_remote(&coll, device, op.lamport);
        Ok(outcome)
    }

    /// Apply a snapshot: replace all records in the collection with snapshot's records.
    pub async fn apply_snapshot(&self, snap: SnapshotMsg) -> SyncResult<()> {
        let coll = CollectionId::new(snap.collection.clone());
        // Replace all records in collection with those from snapshot.
        // For simplicity, write all snapshot records; tombstoned records that no longer exist in snapshot
        // are NOT removed (snapshot only carries live records in v1).
        for rec in &snap.records {
            self.records.put_record(&coll, rec).await?;
        }
        // Bump local clock to at least snap.lamport_floor.
        self.update_state(&coll, |s| {
            s.last_recv_lamport = Lamport(s.last_recv_lamport.0.max(snap.lamport_floor));
        });
        Ok(())
    }

    /// Pull and apply a delta (op log since lamport).
    pub async fn apply_delta(&self, coll: CollectionId, ops: Vec<OperationMsg>) -> SyncResult<()> {
        for op in ops {
            self.apply_remote(op).await?;
        }
        Ok(())
    }

    /// Get a record from local storage.
    pub async fn get_record(&self, coll: &CollectionId, id: &RecordId) -> SyncResult<Option<RecordMsg>> {
        Ok(self.records.get_record(coll, id).await?)
    }

    /// List pending ops (in-memory) for the collection, optionally persisted.
    pub async fn pending_ops(&self, coll: &CollectionId) -> SyncResult<Vec<OperationMsg>> {
        let latest = self.oplog.latest_lamport(coll).await?.unwrap_or(Lamport::ZERO);
        Ok(self.oplog.op_log_since(coll, latest).await?)
        // NB: returns ops since the latest — for testing simplicity.
    }

    /// Drain pending ops since the given lamport (used for resume after reconnect).
    pub async fn ops_since(&self, coll: &CollectionId, since: Lamport) -> SyncResult<Vec<OperationMsg>> {
        Ok(self.oplog.op_log_since(coll, since).await?)
    }

    /// Force-save a snapshot.
    pub async fn save_snapshot(&self, coll: &CollectionId) -> SyncResult<u64> {
        let records = self
            .records
            .list_collection(coll, &owl_storage::ListFilter::default())
            .await?;
        let lamport_floor = self.oplog.latest_lamport(coll).await?.unwrap_or(Lamport::ZERO).0;
        let revision = records.iter().map(|r| r.revision).max().unwrap_or(0);
        let snap = SnapshotMsg {
            collection: coll.to_string(),
            revision,
            lamport_floor,
            records,
        };
        self.snapshots.save_snapshot(coll, &snap).await?;
        Ok(revision)
    }

    /// Read the latest snapshot (for testing / client catchup).
    pub async fn snapshots_latest(&self, coll: &CollectionId) -> SyncResult<Option<SnapshotMsg>> {
        Ok(self.snapshots.latest_snapshot(coll).await?)
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use crate::merge::MergeOutcome;
    use owl_storage::MemoryBackend;
    use owl_types::DeviceId;

    fn make_engine(d: DeviceId) -> (SyncEngine, Arc<MemoryBackend>) {
        let s = Arc::new(MemoryBackend::new());
        let records: Arc<dyn owl_storage::RecordStore> = s.clone();
        let oplog: Arc<dyn owl_storage::OpLogStore> = s.clone();
        let snapshots: Arc<dyn owl_storage::SnapshotStore> = s.clone();
        (SyncEngine::new(d, records, oplog, snapshots), s)
    }

    #[tokio::test]
    async fn local_set_field_creates_record() {
        let d = DeviceId::new();
        let (e, _s) = make_engine(d);
        let coll = CollectionId::new("users");
        e.local_set_field(coll.clone(), RecordId::new("u1"), "name", Value::String("alice".into())).await.unwrap();
        let rec = e.get_record(&coll, &RecordId::new("u1")).await.unwrap().unwrap();
        assert_eq!(rec.fields.get("name"), Some(&Value::String("alice".into())));
        assert_eq!(rec.revision, 1);
    }

    #[tokio::test]
    async fn two_device_concurrent_merges() {
        let d1 = DeviceId::from_bytes([1u8; 16]);
        let d2 = DeviceId::from_bytes([2u8; 16]);
        let (e1, _s1) = make_engine(d1);
        let (e2, _s2) = make_engine(d2);
        let coll = CollectionId::new("users");
        let op1 = e1.local_set_field(coll.clone(), RecordId::new("u1"), "name", Value::String("alice".into())).await.unwrap();
        let op2 = e2.local_set_field(coll.clone(), RecordId::new("u1"), "age", Value::Int(30)).await.unwrap();
        e1.apply_remote(op2.clone()).await.unwrap();
        e2.apply_remote(op1.clone()).await.unwrap();
        let r1 = e1.get_record(&coll, &RecordId::new("u1")).await.unwrap().unwrap();
        let r2 = e2.get_record(&coll, &RecordId::new("u1")).await.unwrap().unwrap();
        assert_eq!(r1.fields, r2.fields);
    }

    #[tokio::test]
    async fn tombstone_permanent_blocks_update() {
        let d = DeviceId::new();
        let (e, _s) = make_engine(d);
        let coll = CollectionId::new("users");
        e.local_set_field(coll.clone(), RecordId::new("u1"), "name", Value::String("alice".into())).await.unwrap();
        e.local_delete(coll.clone(), RecordId::new("u1")).await.unwrap();
        // Try to update a tombstoned record — the value should not change.
        e.local_set_field(coll.clone(), RecordId::new("u1"), "name", Value::String("zombie".into())).await.unwrap();
        let r = e.get_record(&coll, &RecordId::new("u1")).await.unwrap().unwrap();
        assert!(r.tombstone);
        assert_eq!(r.fields.get("name"), Some(&Value::String("alice".into())));
    }

    #[tokio::test]
    async fn restore_revives_record() {
        let d = DeviceId::new();
        let (e, _s) = make_engine(d);
        let coll = CollectionId::new("users");
        e.local_set_field(coll.clone(), RecordId::new("u1"), "name", Value::String("alice".into())).await.unwrap();
        e.local_delete(coll.clone(), RecordId::new("u1")).await.unwrap();
        e.local_restore(coll.clone(), RecordId::new("u1")).await.unwrap();
        let r = e.get_record(&coll, &RecordId::new("u1")).await.unwrap().unwrap();
        assert!(!r.tombstone);
        assert_eq!(r.fields.get("name"), Some(&Value::String("alice".into())));
    }

    #[tokio::test]
    async fn replay_idempotent_by_op_id() {
        let d = DeviceId::new();
        let (e, _s) = make_engine(d);
        let coll = CollectionId::new("users");
        let op = e.local_set_field(coll.clone(), RecordId::new("u1"), "name", Value::String("alice".into())).await.unwrap();
        let outcome1 = e.apply_remote(op.clone()).await.unwrap();
        let outcome2 = e.apply_remote(op.clone()).await.unwrap();
        assert_eq!(outcome1, MergeOutcome::NoOp);
        assert_eq!(outcome2, MergeOutcome::NoOp);
    }

    #[tokio::test]
    async fn snapshot_then_delta_syncs_new_client() {
        let d_server = DeviceId::from_bytes([1u8; 16]);
        let (server, _s_server) = make_engine(d_server);
        let coll = CollectionId::new("users");
        server.local_set_field(coll.clone(), RecordId::new("u1"), "name", Value::String("alice".into())).await.unwrap();
        server.local_set_field(coll.clone(), RecordId::new("u2"), "name", Value::String("bob".into())).await.unwrap();
        let rev = server.save_snapshot(&coll).await.unwrap();
        let snap = server.snapshots_latest(&coll).await.unwrap().unwrap();
        assert_eq!(rev, snap.revision);
        server.local_set_field(coll.clone(), RecordId::new("u3"), "name", Value::String("carol".into())).await.unwrap();
        let delta = server.ops_since(&coll, Lamport(snap.lamport_floor)).await.unwrap();
        let d_new = DeviceId::from_bytes([2u8; 16]);
        let (new_client, _s_new) = make_engine(d_new);
        new_client.apply_snapshot(snap).await.unwrap();
        new_client.apply_delta(coll.clone(), delta).await.unwrap();
        let r1 = new_client.get_record(&coll, &RecordId::new("u1")).await.unwrap().unwrap();
        let r2 = new_client.get_record(&coll, &RecordId::new("u2")).await.unwrap().unwrap();
        let r3 = new_client.get_record(&coll, &RecordId::new("u3")).await.unwrap().unwrap();
        assert_eq!(r1.fields.get("name"), Some(&Value::String("alice".into())));
        assert_eq!(r2.fields.get("name"), Some(&Value::String("bob".into())));
        assert_eq!(r3.fields.get("name"), Some(&Value::String("carol".into())));
    }

    #[tokio::test]
    async fn offline_two_device_rejoin_converge() {
        let d1 = DeviceId::from_bytes([10u8; 16]);
        let d2 = DeviceId::from_bytes([20u8; 16]);
        let (e1, _s1) = make_engine(d1);
        let (e2, _s2) = make_engine(d2);
        let coll = CollectionId::new("todos");
        e1.local_set_field(coll.clone(), RecordId::new("t1"), "title", Value::String("buy milk".into())).await.unwrap();
        let init_op = e1.ops_since(&coll, Lamport(0)).await.unwrap().last().cloned().unwrap();
        e2.apply_remote(init_op).await.unwrap();
        e1.local_set_field(coll.clone(), RecordId::new("t1"), "title", Value::String("buy milk + eggs".into())).await.unwrap();
        e2.local_set_field(coll.clone(), RecordId::new("t1"), "done", Value::Bool(true)).await.unwrap();
        let ops1 = e1.ops_since(&coll, Lamport(0)).await.unwrap();
        let ops2 = e2.ops_since(&coll, Lamport(0)).await.unwrap();
        let op1_latest = ops1.last().cloned().unwrap();
        let op2_latest = ops2.last().cloned().unwrap();
        e1.apply_remote(op2_latest.clone()).await.unwrap();
        e2.apply_remote(op1_latest.clone()).await.unwrap();
        let r1 = e1.get_record(&coll, &RecordId::new("t1")).await.unwrap().unwrap();
        let r2 = e2.get_record(&coll, &RecordId::new("t1")).await.unwrap().unwrap();
        assert_eq!(r1.fields, r2.fields);
    }
}

