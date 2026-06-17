//! Apply operations to local state. Field-level LWW with permanent tombstone.

use owl_protocol::{FieldMetaMsg, OperationMsg, OpKind, RecordMsg};
use owl_types::{CollectionId, DeviceId, RecordId, VectorClock};
use std::collections::BTreeMap;
use uuid::Uuid;

#[derive(Debug, thiserror::Error)]
pub enum MergeError {
    #[error("invalid uuid: {0}")]
    InvalidUuid(#[from] uuid::Error),
}

pub type MergeResult<T> = Result<T, MergeError>;

/// Outcome of applying an op to local state.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum MergeOutcome {
    /// Record was changed (inserted, updated, tombstoned, or restored).
    Changed,
    /// Op had no effect (e.g. field-level LWW lost; duplicate; tombstoned record got Insert).
    NoOp,
}

/// Apply an op to `current` (or `None` if no record exists yet) and return the new state.
///
/// Rules:
/// - Insert/Update: per-field LWW by `(lamport, writer_device_id)`.
///   - On tie: higher device_id string wins (lex tiebreak). Actually: `(lamport, device_id)` lexicographically.
/// - Delete: writes tombstone=true (permanent; no automatic resurrection).
/// - Restore: clears tombstone; preserves all existing fields.
/// - If record is tombstoned:
///   - Insert/Update: NoOp (must Restore first)
///   - Delete: NoOp (already deleted)
///   - Restore: clear tombstone
pub fn apply_op(current: Option<&RecordMsg>, op: &OperationMsg) -> MergeResult<(Option<RecordMsg>, MergeOutcome)> {
    let _device = DeviceId(Uuid::parse_str(&op.device_id)?);
    let coll = CollectionId::new(op.collection.clone());
    let rid = RecordId::new(op.record_id.clone());

    match op.kind {
        OpKind::Delete => {
            if let Some(r) = current {
                if r.tombstone {
                    return Ok((Some(r.clone()), MergeOutcome::NoOp));
                }
                let mut new = r.clone();
                new.tombstone = true;
                new.revision = new.revision.saturating_add(1);
                new.vector_clock = r.vector_clock.merged(&clock_from_op(op));
                new.updated_at_ms = op.timestamp_ms;
                Ok((Some(new), MergeOutcome::Changed))
            } else {
                // No record → no-op (tombstone of nothing is a no-op)
                Ok((None, MergeOutcome::NoOp))
            }
        }
        OpKind::Restore => {
            if let Some(r) = current {
                if !r.tombstone {
                    return Ok((Some(r.clone()), MergeOutcome::NoOp));
                }
                let mut new = r.clone();
                new.tombstone = false;
                new.revision = new.revision.saturating_add(1);
                new.vector_clock = r.vector_clock.merged(&clock_from_op(op));
                new.updated_at_ms = op.timestamp_ms;
                Ok((Some(new), MergeOutcome::Changed))
            } else {
                Ok((None, MergeOutcome::NoOp))
            }
        }
        OpKind::Insert | OpKind::Update => {
            if let Some(r) = current {
                if r.tombstone {
                    return Ok((Some(r.clone()), MergeOutcome::NoOp));
                }
                let mut new = r.clone();
                let mut changed = false;
                for fc in &op.field_changes {
                    let incoming = (fc.lamport, fc.writer_device_id.clone());
                    let existing_key = r
                        .field_meta
                        .get(&fc.field_name)
                        .map(|m| (m.lamport, m.writer_device_id.clone()));
                    let wins = match existing_key {
                        None => true,
                        Some(existing) => incoming > existing,
                    };
                    if wins {
                        if let Some(v) = &fc.new_value {
                            new.fields.insert(fc.field_name.clone(), v.clone());
                        }
                        new.field_meta.insert(
                            fc.field_name.clone(),
                            FieldMetaMsg {
                                lamport: fc.lamport,
                                writer_device_id: fc.writer_device_id.clone(),
                            },
                        );
                        changed = true;
                    }
                }
                if changed {
                    new.vector_clock = r.vector_clock.merged(&clock_from_op(op));
                    new.revision = new.revision.saturating_add(1);
                    new.updated_at_ms = op.timestamp_ms;
                    Ok((Some(new), MergeOutcome::Changed))
                } else {
                    Ok((Some(r.clone()), MergeOutcome::NoOp))
                }
            } else {
                // New record. Require at least one field change.
                if op.field_changes.is_empty() {
                    return Ok((None, MergeOutcome::NoOp));
                }
                let mut fields = BTreeMap::new();
                let mut field_meta = BTreeMap::new();
                for fc in &op.field_changes {
                    if let Some(v) = &fc.new_value {
                        fields.insert(fc.field_name.clone(), v.clone());
                    }
                    field_meta.insert(
                        fc.field_name.clone(),
                        FieldMetaMsg {
                            lamport: fc.lamport,
                            writer_device_id: fc.writer_device_id.clone(),
                        },
                    );
                }
                let rec = RecordMsg {
                    collection: coll.to_string(),
                    record_id: rid.to_string(),
                    revision: 1,
                    vector_clock: clock_from_op(op),
                    tombstone: false,
                    fields,
                    field_meta,
                    updated_at_ms: op.timestamp_ms,
                };
                Ok((Some(rec), MergeOutcome::Changed))
            }
        }
        OpKind::Unspecified => Ok((current.cloned(), MergeOutcome::NoOp)),
    }
}

fn clock_from_op(op: &OperationMsg) -> VectorClock {
    // The op's vector clock is the base_clock the writer observed, plus its own lamport increment.
    let mut c = op.base_clock.clone();
    if let Ok(dev) = Uuid::parse_str(&op.device_id) {
        c.increment_to(DeviceId(dev), op.lamport);
    }
    c
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::op::make_field_change;
    use owl_protocol::Value;
    use owl_types::{DeviceId, Lamport};

    fn dev() -> DeviceId {
        DeviceId::new()
    }

    fn base_record() -> RecordMsg {
        let mut fields = BTreeMap::new();
        fields.insert("name".into(), Value::String("alice".into()));
        let mut meta = BTreeMap::new();
        meta.insert("name".into(), FieldMetaMsg {
            lamport: 1,
            writer_device_id: dev().to_string(),
        });
        RecordMsg {
            collection: "users".into(),
            record_id: "u1".into(),
            revision: 1,
            vector_clock: VectorClock::new(),
            tombstone: false,
            fields,
            field_meta: meta,
            updated_at_ms: 1,
        }
    }

    #[test]
    fn update_winner_overwrites_field() {
        let d = dev();
        let rec = base_record();
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d.to_string(),
            lamport: 5,
            collection: "users".into(),
            record_id: "u1".into(),
            kind: OpKind::Update,
            field_changes: vec![make_field_change("name", Value::String("alice2".into()), Lamport(5), d)],
            base_clock: VectorClock::new(),
            timestamp_ms: 5,
        };
        let (new, outcome) = apply_op(Some(&rec), &op).unwrap();
        assert_eq!(outcome, MergeOutcome::Changed);
        let r = new.unwrap();
        assert_eq!(r.fields.get("name"), Some(&Value::String("alice2".into())));
    }

    #[test]
    fn update_loser_is_noop() {
        // Use a fixed device id for both record meta and op so lamport is the
        // sole ordering criterion. Lower lamport (existing=10) wins over incoming=5.
        let d = DeviceId::from_bytes([1u8; 16]);
        let mut rec = base_record();
        rec.field_meta.insert("name".into(), FieldMetaMsg { lamport: 10, writer_device_id: d.to_string() });
        rec.fields.insert("name".into(), Value::String("winner".into()));
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d.to_string(),
            lamport: 5, // strictly lower
            collection: "users".into(),
            record_id: "u1".into(),
            kind: OpKind::Update,
            field_changes: vec![make_field_change("name", Value::String("loser".into()), Lamport(5), d)],
            base_clock: VectorClock::new(),
            timestamp_ms: 5,
        };
        let (new, outcome) = apply_op(Some(&rec), &op).unwrap();
        assert_eq!(outcome, MergeOutcome::NoOp);
        let r = new.unwrap();
        assert_eq!(r.fields.get("name"), Some(&Value::String("winner".into())));
    }

    #[test]
    fn update_loses_to_higher_lamport() {
        let d = dev();
        let mut rec = base_record();
        // Existing field has lamport 10 from this device
        rec.field_meta.insert("name".into(), FieldMetaMsg { lamport: 10, writer_device_id: d.to_string() });
        rec.fields.insert("name".into(), Value::String("latest".into()));
        // Incoming op has lamport 5
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d.to_string(),
            lamport: 5,
            collection: "users".into(),
            record_id: "u1".into(),
            kind: OpKind::Update,
            field_changes: vec![make_field_change("name", Value::String("older".into()), Lamport(5), d)],
            base_clock: VectorClock::new(),
            timestamp_ms: 5,
        };
        let (new, outcome) = apply_op(Some(&rec), &op).unwrap();
        assert_eq!(outcome, MergeOutcome::NoOp);
        let r = new.unwrap();
        assert_eq!(r.fields.get("name"), Some(&Value::String("latest".into())));
    }

    #[test]
    fn tombstone_is_permanent() {
        let d = dev();
        let mut rec = base_record();
        rec.tombstone = true;
        // Try to update a tombstoned record
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d.to_string(),
            lamport: 100,
            collection: "users".into(),
            record_id: "u1".into(),
            kind: OpKind::Update,
            field_changes: vec![make_field_change("name", Value::String("resurrected".into()), Lamport(100), d)],
            base_clock: VectorClock::new(),
            timestamp_ms: 100,
        };
        let (new, outcome) = apply_op(Some(&rec), &op).unwrap();
        assert_eq!(outcome, MergeOutcome::NoOp);
        let r = new.unwrap();
        assert!(r.tombstone);
    }

    #[test]
    fn restore_clears_tombstone() {
        let d = dev();
        let mut rec = base_record();
        rec.tombstone = true;
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d.to_string(),
            lamport: 50,
            collection: "users".into(),
            record_id: "u1".into(),
            kind: OpKind::Restore,
            field_changes: vec![],
            base_clock: VectorClock::new(),
            timestamp_ms: 50,
        };
        let (new, outcome) = apply_op(Some(&rec), &op).unwrap();
        assert_eq!(outcome, MergeOutcome::Changed);
        assert!(!new.unwrap().tombstone);
    }

    #[test]
    fn delete_sets_tombstone() {
        let d = dev();
        let rec = base_record();
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d.to_string(),
            lamport: 10,
            collection: "users".into(),
            record_id: "u1".into(),
            kind: OpKind::Delete,
            field_changes: vec![],
            base_clock: VectorClock::new(),
            timestamp_ms: 10,
        };
        let (new, outcome) = apply_op(Some(&rec), &op).unwrap();
        assert_eq!(outcome, MergeOutcome::Changed);
        assert!(new.unwrap().tombstone);
    }

    #[test]
    fn insert_creates_new_record() {
        let d = dev();
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d.to_string(),
            lamport: 1,
            collection: "users".into(),
            record_id: "u2".into(),
            kind: OpKind::Insert,
            field_changes: vec![make_field_change("name", Value::String("new".into()), Lamport(1), d)],
            base_clock: VectorClock::new(),
            timestamp_ms: 1,
        };
        let (new, outcome) = apply_op(None, &op).unwrap();
        assert_eq!(outcome, MergeOutcome::Changed);
        let r = new.unwrap();
        assert_eq!(r.record_id, "u2");
        assert_eq!(r.revision, 1);
    }

    #[test]
    fn concurrent_different_fields_both_kept() {
        let d1 = DeviceId::from_bytes([1u8; 16]);
        let d2 = DeviceId::from_bytes([2u8; 16]);
        let mut rec = base_record();
        // d1 wrote name at lamport 1
        rec.field_meta.insert("name".into(), FieldMetaMsg { lamport: 1, writer_device_id: d1.to_string() });
        // d2 writes age at lamport 1
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d2.to_string(),
            lamport: 1,
            collection: "users".into(),
            record_id: "u1".into(),
            kind: OpKind::Update,
            field_changes: vec![make_field_change("age", Value::Int(30), Lamport(1), d2)],
            base_clock: VectorClock::new(),
            timestamp_ms: 1,
        };
        let (new, outcome) = apply_op(Some(&rec), &op).unwrap();
        assert_eq!(outcome, MergeOutcome::Changed);
        let r = new.unwrap();
        assert_eq!(r.fields.get("name"), Some(&Value::String("alice".into())));
        assert_eq!(r.fields.get("age"), Some(&Value::Int(30)));
    }

    #[test]
    fn tie_breaker_uses_device_id() {
        let d1 = DeviceId::from_bytes([1u8; 16]);
        let d2 = DeviceId::from_bytes([2u8; 16]);
        // d1 wrote at lamport 5
        let mut rec = base_record();
        rec.field_meta.insert("name".into(), FieldMetaMsg { lamport: 5, writer_device_id: d1.to_string() });
        // d2 attempts lamport 5 (equal) — should lose (d1 < d2 lex is false, so d2 > d1 lex, so d2 wins)
        let op = OperationMsg {
            op_id: Uuid::now_v7().to_string(),
            device_id: d2.to_string(),
            lamport: 5,
            collection: "users".into(),
            record_id: "u1".into(),
            kind: OpKind::Update,
            field_changes: vec![make_field_change("name", Value::String("from-d2".into()), Lamport(5), d2)],
            base_clock: VectorClock::new(),
            timestamp_ms: 5,
        };
        let (new, outcome) = apply_op(Some(&rec), &op).unwrap();
        // d2 device id > d1 device id lex, so d2 wins
        assert_eq!(outcome, MergeOutcome::Changed);
        let r = new.unwrap();
        assert_eq!(r.fields.get("name"), Some(&Value::String("from-d2".into())));
    }
}
