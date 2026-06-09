//! In-memory storage backend. Used in tests and ephemeral clients.

use crate::traits::*;
use async_trait::async_trait;
use owl_protocol::{OperationMsg, RecordMsg, SnapshotMsg};
use owl_types::{CollectionId, Lamport, OpId, RecordId};
use parking_lot::RwLock;
use std::collections::{BTreeMap, HashMap, VecDeque};
use std::sync::Arc;

#[derive(Default)]
pub struct MemoryBackend {
    records: Arc<RwLock<HashMap<CollectionId, BTreeMap<RecordId, RecordMsg>>>>,
    oplog: Arc<RwLock<HashMap<CollectionId, VecDeque<OperationMsg>>>>,
    oplog_set: Arc<RwLock<HashMap<OpId, ()>>>,
    snapshots: Arc<RwLock<HashMap<CollectionId, Vec<SnapshotMsg>>>>,
}

impl MemoryBackend {
    pub fn new() -> Self {
        Self::default()
    }
}

#[async_trait]
impl RecordStore for MemoryBackend {
    async fn put_record(&self, coll: &CollectionId, rec: &RecordMsg) -> StorageResult<()> {
        let mut g = self.records.write();
        g.entry(coll.clone()).or_default().insert(RecordId::new(rec.record_id.clone()), rec.clone());
        Ok(())
    }
    async fn get_record(&self, coll: &CollectionId, id: &RecordId) -> StorageResult<Option<RecordMsg>> {
        Ok(self.records.read().get(coll).and_then(|m| m.get(id).cloned()))
    }
    async fn delete_record(&self, coll: &CollectionId, id: &RecordId) -> StorageResult<()> {
        if let Some(m) = self.records.write().get_mut(coll) {
            m.remove(id);
        }
        Ok(())
    }
    async fn list_collection(&self, coll: &CollectionId, filter: &ListFilter) -> StorageResult<Vec<RecordMsg>> {
        let g = self.records.read();
        let Some(m) = g.get(coll) else { return Ok(vec![]) };
        let mut out: Vec<RecordMsg> = m
            .values()
            .filter(|r| match filter.tombstoned {
                Some(b) => r.tombstone == b,
                None => true,
            })
            .cloned()
            .collect();
        out.sort_by(|a, b| a.record_id.cmp(&b.record_id));
        if let Some(off) = &filter.after {
            out.retain(|r| r.record_id.as_str() > off.as_str());
        }
        if let Some(limit) = filter.limit {
            out.truncate(limit as usize);
        }
        Ok(out)
    }
    async fn count_collection(&self, coll: &CollectionId, include_tombstoned: bool) -> StorageResult<u64> {
        let g = self.records.read();
        Ok(g.get(coll)
            .map(|m| m.values().filter(|r| include_tombstoned || !r.tombstone).count() as u64)
            .unwrap_or(0))
    }
}

#[async_trait]
impl OpLogStore for MemoryBackend {
    async fn append_op(&self, op: &OperationMsg) -> StorageResult<()> {
        let op_uuid = OpId(uuid::Uuid::parse_str(&op.op_id).map_err(|e| StorageError::Other(e.to_string()))?);
        {
            let mut set = self.oplog_set.write();
            if set.contains_key(&op_uuid) {
                return Ok(()); // idempotent
            }
            set.insert(op_uuid, ());
        }
        let coll = CollectionId::new(op.collection.clone());
        let mut g = self.oplog.write();
        g.entry(coll).or_default().push_back(op.clone());
        Ok(())
    }
    async fn has_op(&self, op_id: &OpId) -> StorageResult<bool> {
        Ok(self.oplog_set.read().contains_key(op_id))
    }
    async fn op_log_since(&self, coll: &CollectionId, since: Lamport) -> StorageResult<Vec<OperationMsg>> {
        let g = self.oplog.read();
        Ok(g.get(coll)
            .map(|q| q.iter().filter(|op| op.lamport > since.0).cloned().collect())
            .unwrap_or_default())
    }
    async fn latest_lamport(&self, coll: &CollectionId) -> StorageResult<Option<Lamport>> {
        let g = self.oplog.read();
        Ok(g.get(coll)
            .and_then(|q| q.iter().map(|op| Lamport(op.lamport)).max()))
    }
    async fn trim_before(&self, coll: &CollectionId, lamport: Lamport) -> StorageResult<u64> {
        let mut g = self.oplog.write();
        if let Some(q) = g.get_mut(coll) {
            let before = q.len();
            q.retain(|op| op.lamport >= lamport.0);
            Ok((before - q.len()) as u64)
        } else {
            Ok(0)
        }
    }
}

#[async_trait]
impl SnapshotStore for MemoryBackend {
    async fn save_snapshot(&self, coll: &CollectionId, snap: &SnapshotMsg) -> StorageResult<()> {
        self.snapshots.write().entry(coll.clone()).or_default().push(snap.clone());
        Ok(())
    }
    async fn load_snapshot(&self, coll: &CollectionId, revision: u64) -> StorageResult<Option<SnapshotMsg>> {
        Ok(self.snapshots.read().get(coll).and_then(|v| v.iter().find(|s| s.revision == revision).cloned()))
    }
    async fn latest_snapshot(&self, coll: &CollectionId) -> StorageResult<Option<SnapshotMsg>> {
        Ok(self.snapshots.read().get(coll).and_then(|v| v.iter().max_by_key(|s| s.revision).cloned()))
    }
    async fn trim_snapshots(&self, coll: &CollectionId, keep: u32) -> StorageResult<u64> {
        let mut g = self.snapshots.write();
        if let Some(v) = g.get_mut(coll) {
            v.sort_by_key(|s| s.revision);
            let remove = v.len().saturating_sub(keep as usize);
            if remove > 0 {
                v.drain(..remove);
            }
            Ok(remove as u64)
        } else {
            Ok(0)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use owl_protocol::Value;
    use owl_types::{DeviceId, Lamport, VectorClock};

    fn rec(id: &str, ts: u64) -> RecordMsg {
        let mut fields = BTreeMap::new();
        fields.insert("name".to_string(), Value::String("alice".into()));
        RecordMsg {
            collection: "users".into(),
            record_id: id.into(),
            revision: ts,
            vector_clock: VectorClock::new(),
            tombstone: false,
            fields,
            field_meta: BTreeMap::new(),
            updated_at_ms: ts,
        }
    }

    fn op(id: &str, lam: u64) -> OperationMsg {
        OperationMsg {
            op_id: id.into(),
            device_id: DeviceId::new().to_string(),
            lamport: lam,
            collection: "users".into(),
            record_id: "r1".into(),
            kind: owl_protocol::OpKind::Update,
            field_changes: vec![],
            base_clock: VectorClock::new(),
            timestamp_ms: lam * 1000,
        }
    }

    #[tokio::test]
    async fn record_put_get_list() {
        let s = MemoryBackend::new();
        s.put_record(&CollectionId::new("users"), &rec("u1", 1)).await.unwrap();
        s.put_record(&CollectionId::new("users"), &rec("u2", 2)).await.unwrap();
        assert_eq!(s.count_collection(&CollectionId::new("users"), true).await.unwrap(), 2);
        let list = s.list_collection(&CollectionId::new("users"), &ListFilter::default()).await.unwrap();
        assert_eq!(list.len(), 2);
        assert!(s.get_record(&CollectionId::new("users"), &RecordId::new("u1")).await.unwrap().is_some());
    }

    #[tokio::test]
    async fn oplog_idempotent_and_ordering() {
        let s = MemoryBackend::new();
        let coll = CollectionId::new("users");
        let id1 = uuid::Uuid::now_v7().to_string();
        let id2 = uuid::Uuid::now_v7().to_string();
        s.append_op(&op(&id1, 1)).await.unwrap();
        s.append_op(&op(&id1, 1)).await.unwrap(); // duplicate
        s.append_op(&op(&id2, 2)).await.unwrap();
        let log = s.op_log_since(&coll, Lamport(0)).await.unwrap();
        assert_eq!(log.len(), 2);
        assert_eq!(log[0].lamport, 1);
        assert_eq!(log[1].lamport, 2);
    }

    #[tokio::test]
    async fn snapshot_latest() {
        let s = MemoryBackend::new();
        let coll = CollectionId::new("c");
        for r in [1u64, 2, 3] {
            s.save_snapshot(&coll, &SnapshotMsg {
                collection: "c".into(),
                revision: r,
                lamport_floor: r * 10,
                records: vec![],
            }).await.unwrap();
        }
        let snap = s.latest_snapshot(&coll).await.unwrap().unwrap();
        assert_eq!(snap.revision, 3);
    }
}
