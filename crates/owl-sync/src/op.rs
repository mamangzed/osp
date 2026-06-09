//! Operation helpers: build, compare, derive fields.

use owl_protocol::{FieldChangeMsg, OperationMsg, OpKind, Value};
use owl_types::{CollectionId, DeviceId, Lamport, RecordId, VectorClock};
use uuid::Uuid;

#[derive(Debug, thiserror::Error)]
pub enum OpBuildError {
    #[error("empty field changes for non-delete op")]
    EmptyFieldChanges,
    #[error("invalid uuid: {0}")]
    InvalidUuid(#[from] uuid::Error),
}

/// Build an Insert/Update operation with field changes.
pub fn build_update(
    device: DeviceId,
    coll: CollectionId,
    record_id: RecordId,
    field_changes: Vec<FieldChangeMsg>,
    base_clock: VectorClock,
    lamport: Lamport,
) -> Result<OperationMsg, OpBuildError> {
    if field_changes.is_empty() {
        return Err(OpBuildError::EmptyFieldChanges);
    }
    Ok(OperationMsg {
        op_id: Uuid::now_v7().to_string(),
        device_id: device.to_string(),
        lamport: lamport.0,
        collection: coll.to_string(),
        record_id: record_id.to_string(),
        kind: OpKind::Update,
        field_changes,
        base_clock,
        timestamp_ms: now_ms(),
    })
}

pub fn build_delete(
    device: DeviceId,
    coll: CollectionId,
    record_id: RecordId,
    base_clock: VectorClock,
    lamport: Lamport,
) -> OperationMsg {
    OperationMsg {
        op_id: Uuid::now_v7().to_string(),
        device_id: device.to_string(),
        lamport: lamport.0,
        collection: coll.to_string(),
        record_id: record_id.to_string(),
        kind: OpKind::Delete,
        field_changes: vec![],
        base_clock,
        timestamp_ms: now_ms(),
    }
}

pub fn build_restore(
    device: DeviceId,
    coll: CollectionId,
    record_id: RecordId,
    base_clock: VectorClock,
    lamport: Lamport,
) -> OperationMsg {
    OperationMsg {
        op_id: Uuid::now_v7().to_string(),
        device_id: device.to_string(),
        lamport: lamport.0,
        collection: coll.to_string(),
        record_id: record_id.to_string(),
        kind: OpKind::Restore,
        field_changes: vec![],
        base_clock,
        timestamp_ms: now_ms(),
    }
}

/// Create a FieldChange for a single field, with the writer's lamport.
pub fn make_field_change(
    name: impl Into<String>,
    value: Value,
    lamport: Lamport,
    writer: DeviceId,
) -> FieldChangeMsg {
    FieldChangeMsg {
        field_name: name.into(),
        new_value: Some(value),
        lamport: lamport.0,
        writer_device_id: writer.to_string(),
    }
}

fn now_ms() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn build_update_assigns_uuidv7() {
        let d = DeviceId::new();
        let op = build_update(
            d,
            CollectionId::new("c"),
            RecordId::new("r"),
            vec![make_field_change("x", Value::Int(1), Lamport(1), d)],
            VectorClock::new(),
            Lamport(1),
        ).unwrap();
        let parsed: Uuid = op.op_id.parse().unwrap();
        assert_eq!(parsed.get_version_num(), 7);
        assert_eq!(op.kind, OpKind::Update);
    }

    #[test]
    fn empty_field_changes_rejected() {
        let d = DeviceId::new();
        let r = build_update(d, CollectionId::new("c"), RecordId::new("r"), vec![], VectorClock::new(), Lamport(1));
        assert!(r.is_err());
    }
}
