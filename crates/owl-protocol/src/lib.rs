//! owl-protocol: protobuf messages + opcode dispatch for OSP.
//!
//! This crate depends on `owl-types` (for newtype IDs) and `owl-transport`
//! is referenced ONLY through `OpCode`. Crucially, `owl-protocol` does NOT
//! depend on `owl-transport` for the actual frame/connection code — it only
//! uses the `OpCode` enum. The transport is interchangeable.

#![forbid(unsafe_code)]


pub mod envelope;
pub mod gen;
pub mod predicate;
pub mod value;

pub use envelope::*;
pub use predicate::Predicate;
pub use value::Value;

// Re-export OpCode from owl-transport for convenience.
pub use owl_transport::OpCode;

pub use crate::gen::common as common_pb;
pub use crate::gen::sync as sync_pb;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn envelope_opcode_mapping() {
        assert_eq!(Envelope::Hello(HelloMsg {
            protocol_version: 1,
            sdk_version: "0.1".into(),
            device_id: "x".into(),
            device_platform: "linux".into(),
            capabilities: vec![],
        }).opcode(), OpCode::Hello);

        assert_eq!(Envelope::Op(OperationMsg {
            op_id: "x".into(),
            device_id: "y".into(),
            lamport: 1,
            collection: "c".into(),
            record_id: "r".into(),
            kind: OpKind::Update,
            field_changes: vec![],
            base_clock: Default::default(),
            timestamp_ms: 0,
        }).opcode(), OpCode::Patch);
    }
}
