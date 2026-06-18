//! SQLite backend implementing all three storage traits in one DB.

use crate::traits::*;
use async_trait::async_trait;
use owl_protocol::{FieldMetaMsg, OperationMsg, RecordMsg, SnapshotMsg, Value};
use owl_types::{CollectionId, Lamport, OpId, RecordId, VectorClock};
use parking_lot::Mutex;
use rusqlite::{Connection, params, OptionalExtension};
use std::collections::BTreeMap;
use std::path::Path;
use std::sync::Arc;

const SCHEMA: &str = r#"
CREATE TABLE IF NOT EXISTS records (
    collection TEXT NOT NULL,
    record_id  TEXT NOT NULL,
    revision   INTEGER NOT NULL,
    vector_clock_json TEXT NOT NULL,
    tombstone  INTEGER NOT NULL,
    fields_json TEXT NOT NULL,
    field_meta_json TEXT NOT NULL,
    updated_at_ms INTEGER NOT NULL,
    PRIMARY KEY (collection, record_id)
);
CREATE INDEX IF NOT EXISTS records_coll ON records(collection);

CREATE TABLE IF NOT EXISTS op_log (
    op_id TEXT PRIMARY KEY,
    collection TEXT NOT NULL,
    lamport INTEGER NOT NULL,
    payload_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS op_log_coll_lam ON op_log(collection, lamport);

CREATE TABLE IF NOT EXISTS snapshots (
    collection TEXT NOT NULL,
    revision   INTEGER NOT NULL,
    lamport_floor INTEGER NOT NULL,
    payload_json TEXT NOT NULL,
    PRIMARY KEY (collection, revision)
);
CREATE INDEX IF NOT EXISTS snapshots_coll ON snapshots(collection);
"#;

pub struct SqliteBackend {
    conn: Arc<Mutex<Connection>>,
}

impl SqliteBackend {
    pub fn open<P: AsRef<Path>>(path: P) -> StorageResult<Self> {
        let conn = Connection::open(path).map_err(|e| StorageError::Sqlite(e.to_string()))?;
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;")
            .map_err(|e| StorageError::Sqlite(e.to_string()))?;
        conn.execute_batch(SCHEMA).map_err(|e| StorageError::Sqlite(e.to_string()))?;
        Ok(Self { conn: Arc::new(Mutex::new(conn)) })
    }

    pub fn open_in_memory() -> StorageResult<Self> {
        let conn = Connection::open_in_memory().map_err(|e| StorageError::Sqlite(e.to_string()))?;
        conn.execute_batch(SCHEMA).map_err(|e| StorageError::Sqlite(e.to_string()))?;
        Ok(Self { conn: Arc::new(Mutex::new(conn)) })
    }
}

fn serialize_clock(c: &VectorClock) -> String {
    serde_json::to_string(&c).unwrap_or_else(|_| "{}".to_string())
}

fn deserialize_clock(s: &str) -> VectorClock {
    serde_json::from_str(s).unwrap_or_default()
}

fn serialize_fields(m: &BTreeMap<String, Value>) -> String {
    serde_json::to_string(m).unwrap_or_else(|_| "{}".to_string())
}

fn deserialize_fields(s: &str) -> BTreeMap<String, Value> {
    serde_json::from_str(s).unwrap_or_default()
}

fn serialize_field_meta(m: &BTreeMap<String, FieldMetaMsg>) -> String {
    serde_json::to_string(m).unwrap_or_else(|_| "{}".to_string())
}

fn deserialize_field_meta(s: &str) -> BTreeMap<String, FieldMetaMsg> {
    serde_json::from_str(s).unwrap_or_default()
}

#[async_trait]
impl RecordStore for SqliteBackend {
    async fn put_record(&self, coll: &CollectionId, rec: &RecordMsg) -> StorageResult<()> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let rec = rec.clone();
        tokio::task::spawn_blocking(move || -> StorageResult<()> {
            let c = conn.lock();
            c.execute(
                "INSERT INTO records (collection, record_id, revision, vector_clock_json, tombstone, fields_json, field_meta_json, updated_at_ms)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(collection, record_id) DO UPDATE SET
                   revision = excluded.revision,
                   vector_clock_json = excluded.vector_clock_json,
                   tombstone = excluded.tombstone,
                   fields_json = excluded.fields_json,
                   field_meta_json = excluded.field_meta_json,
                   updated_at_ms = excluded.updated_at_ms",
                params![
                    coll_s,
                    rec.record_id,
                    rec.revision as i64,
                    serialize_clock(&rec.vector_clock),
                    rec.tombstone as i64,
                    serialize_fields(&rec.fields),
                    serialize_field_meta(&rec.field_meta),
                    rec.updated_at_ms as i64,
                ],
            ).map_err(|e| StorageError::Sqlite(e.to_string()))?;
            Ok(())
        }).await.map_err(|e| StorageError::Other(e.to_string()))?
    }

    async fn get_record(&self, coll: &CollectionId, id: &RecordId) -> StorageResult<Option<RecordMsg>> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let id_s = id.to_string();
        let out: Result<Option<RecordMsg>, String> = tokio::task::spawn_blocking(move || -> Result<Option<RecordMsg>, String> {
            let c = conn.lock();
            let row = c.query_row(
                "SELECT record_id, revision, vector_clock_json, tombstone, fields_json, field_meta_json, updated_at_ms
                 FROM records WHERE collection = ? AND record_id = ?",
                params![coll_s, id_s],
                |r| {
                    Ok((
                        r.get::<_, String>(0)?,
                        r.get::<_, i64>(1)?,
                        r.get::<_, String>(2)?,
                        r.get::<_, i64>(3)?,
                        r.get::<_, String>(4)?,
                        r.get::<_, String>(5)?,
                        r.get::<_, i64>(6)?,
                    ))
                },
            ).optional().map_err(|e| e.to_string())?;
            Ok(row.map(|(rid, rev, vc, tomb, fields, meta, ts)| RecordMsg {
                collection: String::new(), // filled by caller
                record_id: rid,
                revision: rev as u64,
                vector_clock: deserialize_clock(&vc),
                tombstone: tomb != 0,
                fields: deserialize_fields(&fields),
                field_meta: deserialize_field_meta(&meta),
                updated_at_ms: ts as u64,
            }))
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map(|opt| opt.map(|mut r| { r.collection = coll.to_string(); r })).map_err(StorageError::Other)
    }

    async fn delete_record(&self, coll: &CollectionId, id: &RecordId) -> StorageResult<()> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let id_s = id.to_string();
        tokio::task::spawn_blocking(move || -> StorageResult<()> {
            let c = conn.lock();
            c.execute("DELETE FROM records WHERE collection = ? AND record_id = ?", params![coll_s, id_s])
                .map_err(|e| StorageError::Sqlite(e.to_string()))?;
            Ok(())
        }).await.map_err(|e| StorageError::Other(e.to_string()))?
    }

    async fn list_collection(&self, coll: &CollectionId, filter: &ListFilter) -> StorageResult<Vec<RecordMsg>> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let filter = filter.clone();
        let out: Result<Vec<RecordMsg>, String> = tokio::task::spawn_blocking(move || -> Result<Vec<RecordMsg>, String> {
            let c = conn.lock();
            let mut sql = String::from("SELECT record_id, revision, vector_clock_json, tombstone, fields_json, field_meta_json, updated_at_ms FROM records WHERE collection = ?");
            let mut bound: Vec<Box<dyn rusqlite::ToSql>> = vec![Box::new(coll_s.clone())];
            if let Some(t) = filter.tombstoned {
                sql.push_str(" AND tombstone = ?");
                bound.push(Box::new(t as i64));
            }
            if let Some(after) = &filter.after {
                sql.push_str(" AND record_id > ?");
                bound.push(Box::new(after.to_string()));
            }
            sql.push_str(" ORDER BY record_id");
            if filter.descending {
                sql.push_str(" DESC");
            }
            if let Some(limit) = filter.limit {
                sql.push_str(&format!(" LIMIT {}", limit));
            }
            let mut stmt = c.prepare(&sql).map_err(|e| e.to_string())?;
            let params_iter: Vec<&dyn rusqlite::ToSql> = bound.iter().map(|b| b.as_ref()).collect();
            let rows = stmt.query_map(params_iter.as_slice(), |r| {
                Ok((
                    r.get::<_, String>(0)?,
                    r.get::<_, i64>(1)?,
                    r.get::<_, String>(2)?,
                    r.get::<_, i64>(3)?,
                    r.get::<_, String>(4)?,
                    r.get::<_, String>(5)?,
                    r.get::<_, i64>(6)?,
                ))
            }).map_err(|e| e.to_string())?;
            let mut out = Vec::new();
            for row in rows {
                let (rid, rev, vc, tomb, fields, meta, ts) = row.map_err(|e| e.to_string())?;
                out.push(RecordMsg {
                    collection: coll_s.clone(),
                    record_id: rid,
                    revision: rev as u64,
                    vector_clock: deserialize_clock(&vc),
                    tombstone: tomb != 0,
                    fields: deserialize_fields(&fields),
                    field_meta: deserialize_field_meta(&meta),
                    updated_at_ms: ts as u64,
                });
            }
            Ok(out)
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map_err(StorageError::Other)
    }

    async fn count_collection(&self, coll: &CollectionId, include_tombstoned: bool) -> StorageResult<u64> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let out: Result<u64, String> = tokio::task::spawn_blocking(move || -> Result<u64, String> {
            let c = conn.lock();
            let sql = if include_tombstoned {
                "SELECT COUNT(*) FROM records WHERE collection = ?"
            } else {
                "SELECT COUNT(*) FROM records WHERE collection = ? AND tombstone = 0"
            };
            let n: i64 = c.query_row(sql, params![coll_s], |r| r.get(0)).map_err(|e| e.to_string())?;
            Ok(n as u64)
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map_err(StorageError::Other)
    }
}

#[async_trait]
impl OpLogStore for SqliteBackend {
    async fn append_op(&self, op: &OperationMsg) -> StorageResult<()> {
        let conn = self.conn.clone();
        let op = op.clone();
        tokio::task::spawn_blocking(move || -> StorageResult<()> {
            let c = conn.lock();
            let payload = serde_json::to_string(&op).map_err(|e| StorageError::Serde(e.to_string()))?;
            c.execute(
                "INSERT OR IGNORE INTO op_log (op_id, collection, lamport, payload_json) VALUES (?, ?, ?, ?)",
                params![op.op_id, op.collection, op.lamport as i64, payload],
            ).map_err(|e| StorageError::Sqlite(e.to_string()))?;
            Ok(())
        }).await.map_err(|e| StorageError::Other(e.to_string()))?
    }

    async fn has_op(&self, op_id: &OpId) -> StorageResult<bool> {
        let conn = self.conn.clone();
        let id = op_id.to_string();
        let out: Result<bool, String> = tokio::task::spawn_blocking(move || -> Result<bool, String> {
            let c = conn.lock();
            let n: i64 = c.query_row("SELECT COUNT(*) FROM op_log WHERE op_id = ?", params![id], |r| r.get(0))
                .map_err(|e| e.to_string())?;
            Ok(n > 0)
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map_err(StorageError::Other)
    }

    async fn op_log_since(&self, coll: &CollectionId, since: Lamport) -> StorageResult<Vec<OperationMsg>> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let since = since.0 as i64;
        let out: Result<Vec<OperationMsg>, String> = tokio::task::spawn_blocking(move || -> Result<Vec<OperationMsg>, String> {
            let c = conn.lock();
            let mut stmt = c.prepare("SELECT payload_json FROM op_log WHERE collection = ? AND lamport > ? ORDER BY lamport ASC")
                .map_err(|e| e.to_string())?;
            let rows = stmt.query_map(params![coll_s, since], |r| r.get::<_, String>(0))
                .map_err(|e| e.to_string())?;
            let mut out = Vec::new();
            for row in rows {
                let s = row.map_err(|e| e.to_string())?;
                let op: OperationMsg = serde_json::from_str(&s).map_err(|e| e.to_string())?;
                out.push(op);
            }
            Ok(out)
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map_err(StorageError::Other)
    }

    async fn latest_lamport(&self, coll: &CollectionId) -> StorageResult<Option<Lamport>> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let out: Result<Option<u64>, String> = tokio::task::spawn_blocking(move || -> Result<Option<u64>, String> {
            let c = conn.lock();
            let n: Option<i64> = c.query_row(
                "SELECT MAX(lamport) FROM op_log WHERE collection = ?",
                params![coll_s],
                |r| r.get(0)
            ).map_err(|e| e.to_string())?;
            Ok(n.map(|x| x as u64))
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map(|o| o.map(Lamport)).map_err(StorageError::Other)
    }

    async fn trim_before(&self, coll: &CollectionId, lamport: Lamport) -> StorageResult<u64> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let lam = lamport.0 as i64;
        let out: Result<u64, String> = tokio::task::spawn_blocking(move || -> Result<u64, String> {
            let c = conn.lock();
            let n = c.execute("DELETE FROM op_log WHERE collection = ? AND lamport < ?", params![coll_s, lam])
                .map_err(|e| e.to_string())?;
            Ok(n as u64)
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map_err(StorageError::Other)
    }
}

#[async_trait]
impl SnapshotStore for SqliteBackend {
    async fn save_snapshot(&self, coll: &CollectionId, snap: &SnapshotMsg) -> StorageResult<()> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let snap = snap.clone();
        tokio::task::spawn_blocking(move || -> StorageResult<()> {
            let c = conn.lock();
            let payload = serde_json::to_string(&snap).map_err(|e| StorageError::Serde(e.to_string()))?;
            c.execute(
                "INSERT OR REPLACE INTO snapshots (collection, revision, lamport_floor, payload_json) VALUES (?, ?, ?, ?)",
                params![coll_s, snap.revision as i64, snap.lamport_floor as i64, payload],
            ).map_err(|e| StorageError::Sqlite(e.to_string()))?;
            Ok(())
        }).await.map_err(|e| StorageError::Other(e.to_string()))?
    }

    async fn load_snapshot(&self, coll: &CollectionId, revision: u64) -> StorageResult<Option<SnapshotMsg>> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let rev = revision as i64;
        let out: Result<Option<SnapshotMsg>, String> = tokio::task::spawn_blocking(move || -> Result<Option<SnapshotMsg>, String> {
            let c = conn.lock();
            let row: Option<String> = c.query_row("SELECT payload_json FROM snapshots WHERE collection = ? AND revision = ?",
                params![coll_s, rev], |r| r.get(0)).optional().map_err(|e| e.to_string())?;
            row.map(|s| serde_json::from_str(&s).map_err(|e| e.to_string())).transpose()
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map_err(StorageError::Other)
    }

    async fn latest_snapshot(&self, coll: &CollectionId) -> StorageResult<Option<SnapshotMsg>> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let out: Result<Option<SnapshotMsg>, String> = tokio::task::spawn_blocking(move || -> Result<Option<SnapshotMsg>, String> {
            let c = conn.lock();
            let row: Option<String> = c.query_row("SELECT payload_json FROM snapshots WHERE collection = ? ORDER BY revision DESC LIMIT 1",
                params![coll_s], |r| r.get(0)).optional().map_err(|e| e.to_string())?;
            row.map(|s| serde_json::from_str(&s).map_err(|e| e.to_string())).transpose()
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map_err(StorageError::Other)
    }

    async fn trim_snapshots(&self, coll: &CollectionId, keep: u32) -> StorageResult<u64> {
        let conn = self.conn.clone();
        let coll_s = coll.to_string();
        let out: Result<u64, String> = tokio::task::spawn_blocking(move || -> Result<u64, String> {
            let c = conn.lock();
            let n: i64 = c.query_row("SELECT COUNT(*) FROM snapshots WHERE collection = ?", params![coll_s], |r| r.get(0))
                .map_err(|e| e.to_string())?;
            let total = n as u64;
            let remove = total.saturating_sub(keep as u64);
            if remove > 0 {
                c.execute(
                    "DELETE FROM snapshots WHERE collection = ? AND revision IN (SELECT revision FROM snapshots WHERE collection = ? ORDER BY revision ASC LIMIT ?)",
                    params![coll_s, coll_s, remove as i64],
                ).map_err(|e| e.to_string())?;
            }
            Ok(remove)
        }).await.map_err(|e| StorageError::Other(e.to_string()))?;
        out.map_err(StorageError::Other)
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
    async fn sqlite_record_round_trip() {
        let s = SqliteBackend::open_in_memory().unwrap();
        let coll = CollectionId::new("users");
        s.put_record(&coll, &rec("u1", 1)).await.unwrap();
        s.put_record(&coll, &rec("u2", 2)).await.unwrap();
        let got = s.get_record(&coll, &RecordId::new("u1")).await.unwrap().unwrap();
        assert_eq!(got.record_id, "u1");
        assert_eq!(s.count_collection(&coll, true).await.unwrap(), 2);
    }

    #[tokio::test]
    async fn sqlite_oplog_idempotent() {
        let s = SqliteBackend::open_in_memory().unwrap();
        let id1 = uuid::Uuid::now_v7().to_string();
        let id2 = uuid::Uuid::now_v7().to_string();
        s.append_op(&op(&id1, 1)).await.unwrap();
        s.append_op(&op(&id1, 1)).await.unwrap();
        s.append_op(&op(&id2, 2)).await.unwrap();
        let log = s.op_log_since(&CollectionId::new("users"), Lamport(0)).await.unwrap();
        assert_eq!(log.len(), 2);
    }

    #[tokio::test]
    async fn sqlite_snapshot_latest_and_trim() {
        let s = SqliteBackend::open_in_memory().unwrap();
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
        let removed = s.trim_snapshots(&coll, 1).await.unwrap();
        assert_eq!(removed, 2);
        let snap = s.latest_snapshot(&coll).await.unwrap().unwrap();
        assert_eq!(snap.revision, 3);
    }

    #[tokio::test]
    async fn sqlite_list_with_filter() {
        let s = SqliteBackend::open_in_memory().unwrap();
        let coll = CollectionId::new("c");
        s.put_record(&coll, &rec("a", 1)).await.unwrap();
        s.put_record(&coll, &rec("b", 2)).await.unwrap();
        s.put_record(&coll, &rec("c", 3)).await.unwrap();
        let v = s.list_collection(&coll, &ListFilter { limit: Some(2), ..Default::default() }).await.unwrap();
        assert_eq!(v.len(), 2);
        assert_eq!(v[0].record_id, "a");
    }
}
