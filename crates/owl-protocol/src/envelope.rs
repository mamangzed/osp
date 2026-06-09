//! Envelope: the typed wrapper around an opcode's payload.

use crate::gen::frame as pb_frame;
use crate::gen::auth as pb_auth;
use crate::gen::common as pb_common;
use crate::gen::sync as pb_sync;
use crate::value::Value;
use owl_transport::OpCode;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ProtocolError {
    #[error("unknown opcode for envelope: 0x{0:04x}")]
    UnknownOpCode(u16),
    #[error("payload type mismatch for opcode {0:?}")]
    PayloadTypeMismatch(OpCode),
    #[error("missing payload for opcode {0:?}")]
    MissingPayload(OpCode),
    #[error("encode: {0}")]
    Encode(String),
    #[error("decode: {0}")]
    Decode(String),
}

/// All typed envelopes that can travel on the wire.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Envelope {
    Hello(HelloMsg),
    HelloAck(HelloAckMsg),
    Auth(AuthMsg),
    AuthOk(AuthOkMsg),
    AuthFailed(AuthFailedMsg),
    Subscribe(SubscribeMsg),
    Unsubscribe(UnsubscribeMsg),
    SubscribeAck(SubscribeAckMsg),
    Op(OperationMsg),
    OpAck(OpAckMsg),
    SyncPush(SyncPushMsg),
    SyncPullRequest(SyncPullRequestMsg),
    SyncPullResponse(SyncPullResponseMsg),
    Snapshot(SnapshotMsg),
    Record(RecordMsg),
    Error(ErrorMsg),
    Ping(HelloMsg),
    Pong(HelloMsg),
    Presence(PresenceMsg),
}

impl Envelope {
    pub fn opcode(&self) -> OpCode {
        match self {
            Self::Hello(_) => OpCode::Hello,
            Self::HelloAck(_) => OpCode::HelloAck,
            Self::Auth(_) => OpCode::Auth,
            Self::AuthOk(_) => OpCode::AuthOk,
            Self::AuthFailed(_) => OpCode::AuthFailed,
            Self::Subscribe(_) => OpCode::Subscribe,
            Self::Unsubscribe(_) => OpCode::Unsubscribe,
            Self::SubscribeAck(_) => OpCode::SubscribeAck,
            Self::Op(_) => OpCode::Patch,
            Self::OpAck(_) => OpCode::Ack,
            Self::SyncPush(_) => OpCode::Sync,
            Self::SyncPullRequest(_) => OpCode::Sync,
            Self::SyncPullResponse(_) => OpCode::Sync,
            Self::Snapshot(_) => OpCode::Sync,
            Self::Record(_) => OpCode::Sync,
            Self::Error(_) => OpCode::Error,
            Self::Ping(_) => OpCode::Ping,
            Self::Pong(_) => OpCode::Pong,
            Self::Presence(_) => OpCode::Presence,
        }
    }

    pub fn encode(&self) -> Result<Vec<u8>, ProtocolError> {
        let pb = self.to_prost();
        let mut buf = Vec::with_capacity(pb.encoded_len());
        pb.encode(&mut buf).map_err(|e| ProtocolError::Encode(e.to_string()))?;
        Ok(buf)
    }

    pub fn decode(opcode: OpCode, bytes: &[u8]) -> Result<Self, ProtocolError> {
        let env_pb = pb_frame::Envelope::decode(bytes).map_err(|e| ProtocolError::Decode(e.to_string()))?;
        Self::from_prost(opcode, env_pb)
    }

    fn to_prost(&self) -> pb_frame::Envelope {
        let mut env = pb_frame::Envelope::default();
        env.payload = Some(match self {
            Self::Hello(m) => pb_frame::envelope::Payload::Hello(m.clone().into()),
            Self::HelloAck(m) => pb_frame::envelope::Payload::HelloAck(m.clone().into()),
            Self::Auth(m) => pb_frame::envelope::Payload::Auth(m.clone().into()),
            Self::AuthOk(m) => pb_frame::envelope::Payload::AuthOk(m.clone().into()),
            Self::AuthFailed(m) => pb_frame::envelope::Payload::AuthFailed(m.clone().into()),
            Self::Subscribe(m) => pb_frame::envelope::Payload::Subscribe(m.clone().into()),
            Self::Unsubscribe(m) => pb_frame::envelope::Payload::Unsubscribe(m.clone().into()),
            Self::SubscribeAck(m) => pb_frame::envelope::Payload::SubscribeAck(m.clone().into()),
            Self::Op(m) => pb_frame::envelope::Payload::Op(m.clone().into()),
            Self::OpAck(m) => pb_frame::envelope::Payload::OpAck(m.clone().into()),
            Self::SyncPush(m) => pb_frame::envelope::Payload::SyncPush(m.clone().into()),
            Self::SyncPullRequest(m) => pb_frame::envelope::Payload::SyncPullRequest(m.clone().into()),
            Self::SyncPullResponse(m) => pb_frame::envelope::Payload::SyncPullResponse(m.clone().into()),
            Self::Snapshot(m) => pb_frame::envelope::Payload::Snapshot(m.clone().into()),
            Self::Record(m) => pb_frame::envelope::Payload::Record(m.clone().into()),
            Self::Error(m) => pb_frame::envelope::Payload::Error(m.clone().into()),
            Self::Ping(m) => pb_frame::envelope::Payload::Hello(m.clone().into()),
            Self::Pong(m) => pb_frame::envelope::Payload::Hello(m.clone().into()),
            Self::Presence(m) => pb_frame::envelope::Payload::Presence(m.clone().into()),
        });
        env
    }

    fn from_prost(opcode: OpCode, env: pb_frame::Envelope) -> Result<Self, ProtocolError> {
        let payload = env.payload.ok_or(ProtocolError::MissingPayload(opcode))?;
        Ok(match payload {
            pb_frame::envelope::Payload::Hello(m) if opcode == OpCode::Ping => Self::Ping(m.into()),
            pb_frame::envelope::Payload::Hello(m) if opcode == OpCode::Pong => Self::Pong(m.into()),
            pb_frame::envelope::Payload::Hello(m) => Self::Hello(m.into()),
            pb_frame::envelope::Payload::HelloAck(m) => Self::HelloAck(m.into()),
            pb_frame::envelope::Payload::Auth(m) => Self::Auth(m.into()),
            pb_frame::envelope::Payload::AuthOk(m) => Self::AuthOk(m.into()),
            pb_frame::envelope::Payload::AuthFailed(m) => Self::AuthFailed(m.into()),
            pb_frame::envelope::Payload::Subscribe(m) => Self::Subscribe(m.into()),
            pb_frame::envelope::Payload::Unsubscribe(m) => Self::Unsubscribe(m.into()),
            pb_frame::envelope::Payload::SubscribeAck(m) => Self::SubscribeAck(m.into()),
            pb_frame::envelope::Payload::Op(m) => Self::Op(m.into()),
            pb_frame::envelope::Payload::OpAck(m) => Self::OpAck(m.into()),
            pb_frame::envelope::Payload::SyncPush(m) => Self::SyncPush(m.into()),
            pb_frame::envelope::Payload::SyncPullRequest(m) => Self::SyncPullRequest(m.into()),
            pb_frame::envelope::Payload::SyncPullResponse(m) => Self::SyncPullResponse(m.into()),
            pb_frame::envelope::Payload::Snapshot(m) => Self::Snapshot(m.into()),
            pb_frame::envelope::Payload::Record(m) => Self::Record(m.into()),
            pb_frame::envelope::Payload::Error(m) => Self::Error(m.into()),
            pb_frame::envelope::Payload::Presence(m) => Self::Presence(m.into()),
        })
    }
}

// ----- Strongly-typed message structs -----

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct HelloMsg {
    pub protocol_version: u32,
    pub sdk_version: String,
    pub device_id: String,
    pub device_platform: String,
    pub capabilities: Vec<Capability>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Capability {
    CompressionZstd,
    Chunking,
    Resume,
    Presence,
    Unknown(i32),
}

impl From<i32> for Capability {
    fn from(v: i32) -> Self {
        match v {
            1 => Self::CompressionZstd,
            2 => Self::Chunking,
            3 => Self::Resume,
            4 => Self::Presence,
            other => Self::Unknown(other),
        }
    }
}

impl From<Capability> for i32 {
    fn from(c: Capability) -> Self {
        match c {
            Capability::CompressionZstd => 1,
            Capability::Chunking => 2,
            Capability::Resume => 3,
            Capability::Presence => 4,
            Capability::Unknown(v) => v,
        }
    }
}

impl From<pb_common::Capability> for Capability {
    fn from(c: pb_common::Capability) -> Self {
        match c {
            pb_common::Capability::CompressionZstd => Self::CompressionZstd,
            pb_common::Capability::Chunking => Self::Chunking,
            pb_common::Capability::Resume => Self::Resume,
            pb_common::Capability::Presence => Self::Presence,
            _ => Self::Unknown(0),
        }
    }
}

impl From<Capability> for pb_common::Capability {
    fn from(c: Capability) -> Self {
        match c {
            Capability::CompressionZstd => Self::CompressionZstd,
            Capability::Chunking => Self::Chunking,
            Capability::Resume => Self::Resume,
            Capability::Presence => Self::Presence,
            Capability::Unknown(_) => Self::Unspecified,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct HelloAckMsg {
    pub protocol_version: u32,
    pub server_version: String,
    pub session_id: String,
    pub heartbeat_interval_ms: u32,
    pub selected_capabilities: Vec<Capability>,
    pub snapshot_window: u64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AuthMsg {
    pub token: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AuthOkMsg {
    pub device_id: String,
    pub collection_scopes: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AuthFailedMsg {
    pub code: u32,
    pub message: String,
    pub detail: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SubscribeMsg {
    pub subscription_id: String,
    pub collection: String,
    pub predicate: Option<crate::predicate::Predicate>,
    pub limit: u32,
    pub with_snapshot: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct UnsubscribeMsg {
    pub subscription_id: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SubscribeAckMsg {
    pub subscription_id: String,
    pub accepted: bool,
    pub error: Option<ErrorMsg>,
    pub snapshot_revision: u64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct OperationMsg {
    pub op_id: String,
    pub device_id: String,
    pub lamport: u64,
    pub collection: String,
    pub record_id: String,
    pub kind: OpKind,
    pub field_changes: Vec<FieldChangeMsg>,
    pub base_clock: owl_types::VectorClock,
    pub timestamp_ms: u64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum OpKind {
    Insert,
    Update,
    Delete,
    Restore,
    Unspecified,
}

impl From<i32> for OpKind {
    fn from(v: i32) -> Self {
        match v {
            1 => Self::Insert,
            2 => Self::Update,
            3 => Self::Delete,
            4 => Self::Restore,
            _ => Self::Unspecified,
        }
    }
}

impl From<OpKind> for i32 {
    fn from(k: OpKind) -> Self {
        match k {
            OpKind::Insert => 1,
            OpKind::Update => 2,
            OpKind::Delete => 3,
            OpKind::Restore => 4,
            OpKind::Unspecified => 0,
        }
    }
}

impl From<pb_sync::OpKind> for OpKind {
    fn from(k: pb_sync::OpKind) -> Self {
        match k {
            pb_sync::OpKind::Insert => Self::Insert,
            pb_sync::OpKind::Update => Self::Update,
            pb_sync::OpKind::Delete => Self::Delete,
            pb_sync::OpKind::Restore => Self::Restore,
            _ => Self::Unspecified,
        }
    }
}

impl From<OpKind> for pb_sync::OpKind {
    fn from(k: OpKind) -> Self {
        match k {
            OpKind::Insert => Self::Insert,
            OpKind::Update => Self::Update,
            OpKind::Delete => Self::Delete,
            OpKind::Restore => Self::Restore,
            OpKind::Unspecified => Self::Unspecified,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FieldChangeMsg {
    pub field_name: String,
    pub new_value: Option<Value>,
    pub lamport: u64,
    pub writer_device_id: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct OpAckMsg {
    pub op_id: String,
    pub accepted: bool,
    pub error: Option<ErrorMsg>,
    pub revision: u64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SyncPushMsg {
    pub ops: Vec<OperationMsg>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SyncPullRequestMsg {
    pub collection: String,
    pub since_lamport: u64,
    pub max_ops: u32,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SyncPullResponseMsg {
    pub collection: String,
    pub since_lamport: u64,
    pub ops: Vec<OperationMsg>,
    pub has_more: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SnapshotMsg {
    pub collection: String,
    pub revision: u64,
    pub lamport_floor: u64,
    pub records: Vec<RecordMsg>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RecordMsg {
    pub collection: String,
    pub record_id: String,
    pub revision: u64,
    pub vector_clock: owl_types::VectorClock,
    pub tombstone: bool,
    pub fields: std::collections::BTreeMap<String, Value>,
    pub field_meta: std::collections::BTreeMap<String, FieldMetaMsg>,
    pub updated_at_ms: u64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FieldMetaMsg {
    pub lamport: u64,
    pub writer_device_id: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ErrorMsg {
    pub code: u32,
    pub message: String,
    pub detail: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PresenceMsg {
    pub device_id: String,
    pub status: u32,
    pub lamport: u64,
}

// ----- Prost conversions -----

impl From<pb_common::VClock> for owl_types::VectorClock {
    fn from(pb: pb_common::VClock) -> Self {
        let mut c = owl_types::VectorClock::new();
        for (k, v) in pb.entries {
            if let Ok(uuid) = uuid::Uuid::parse_str(&k) {
                c.set(owl_types::DeviceId(uuid), v);
            }
        }
        c
    }
}

impl From<owl_types::VectorClock> for pb_common::VClock {
    fn from(c: owl_types::VectorClock) -> Self {
        let entries = c.devices().map(|(d, v)| (d.to_string(), v)).collect();
        pb_common::VClock { entries }
    }
}

impl From<pb_auth::Hello> for HelloMsg {
    fn from(pb: pb_auth::Hello) -> Self {
        Self {
            protocol_version: pb.protocol_version,
            sdk_version: pb.sdk_version,
            device_id: pb.device_id,
            device_platform: pb.device_platform,
            capabilities: pb.capabilities.into_iter().map(Into::into).collect(),
        }
    }
}

impl From<HelloMsg> for pb_auth::Hello {
    fn from(m: HelloMsg) -> Self {
        Self {
            protocol_version: m.protocol_version,
            sdk_version: m.sdk_version,
            device_id: m.device_id,
            device_platform: m.device_platform,
            capabilities: m.capabilities.into_iter().map(Into::into).collect(),
        }
    }
}

impl From<pb_auth::HelloAck> for HelloAckMsg {
    fn from(pb: pb_auth::HelloAck) -> Self {
        Self {
            protocol_version: pb.protocol_version,
            server_version: pb.server_version,
            session_id: pb.session_id,
            heartbeat_interval_ms: pb.heartbeat_interval_ms,
            selected_capabilities: pb.selected_capabilities.into_iter().map(Into::into).collect(),
            snapshot_window: pb.snapshot_window,
        }
    }
}

impl From<HelloAckMsg> for pb_auth::HelloAck {
    fn from(m: HelloAckMsg) -> Self {
        Self {
            protocol_version: m.protocol_version,
            server_version: m.server_version,
            session_id: m.session_id,
            heartbeat_interval_ms: m.heartbeat_interval_ms,
            selected_capabilities: m.selected_capabilities.into_iter().map(Into::into).collect(),
            snapshot_window: m.snapshot_window,
        }
    }
}

impl From<pb_auth::Auth> for AuthMsg {
    fn from(pb: pb_auth::Auth) -> Self {
        Self { token: pb.token }
    }
}
impl From<AuthMsg> for pb_auth::Auth {
    fn from(m: AuthMsg) -> Self {
        Self { token: m.token }
    }
}

impl From<pb_auth::AuthOk> for AuthOkMsg {
    fn from(pb: pb_auth::AuthOk) -> Self {
        Self {
            device_id: pb.device_id,
            collection_scopes: pb.collection_scopes,
        }
    }
}
impl From<AuthOkMsg> for pb_auth::AuthOk {
    fn from(m: AuthOkMsg) -> Self {
        Self {
            device_id: m.device_id,
            collection_scopes: m.collection_scopes,
        }
    }
}

impl From<pb_auth::AuthFailed> for AuthFailedMsg {
    fn from(pb: pb_auth::AuthFailed) -> Self {
        let err = pb.error.unwrap_or_default();
        Self { code: err.code, message: err.message, detail: err.detail }
    }
}
impl From<AuthFailedMsg> for pb_auth::AuthFailed {
    fn from(m: AuthFailedMsg) -> Self {
        Self {
            error: Some(pb_common::ErrorInfo {
                code: m.code,
                message: m.message,
                detail: m.detail,
            }),
        }
    }
}

impl From<pb_common::ErrorInfo> for ErrorMsg {
    fn from(pb: pb_common::ErrorInfo) -> Self {
        Self { code: pb.code, message: pb.message, detail: pb.detail }
    }
}
impl From<ErrorMsg> for pb_common::ErrorInfo {
    fn from(m: ErrorMsg) -> Self {
        Self { code: m.code, message: m.message, detail: m.detail }
    }
}

impl From<pb_auth::Presence> for PresenceMsg {
    fn from(pb: pb_auth::Presence) -> Self {
        Self { device_id: pb.device_id, status: pb.status, lamport: pb.lamport }
    }
}

impl From<PresenceMsg> for pb_auth::Presence {
    fn from(m: PresenceMsg) -> Self {
        Self { device_id: m.device_id, status: m.status, lamport: m.lamport }
    }
}

impl From<pb_sync::FieldChange> for FieldChangeMsg {
    fn from(pb: pb_sync::FieldChange) -> Self {
        Self {
            field_name: pb.field_name,
            new_value: pb.new_value.map(Value::from),
            lamport: pb.lamport,
            writer_device_id: pb.writer_device_id,
        }
    }
}
impl From<FieldChangeMsg> for pb_sync::FieldChange {
    fn from(m: FieldChangeMsg) -> Self {
        Self {
            field_name: m.field_name,
            new_value: m.new_value.map(common::Value::from),
            lamport: m.lamport,
            writer_device_id: m.writer_device_id,
        }
    }
}

impl From<pb_sync::FieldMeta> for FieldMetaMsg {
    fn from(pb: pb_sync::FieldMeta) -> Self {
        Self { lamport: pb.lamport, writer_device_id: pb.writer_device_id }
    }
}
impl From<FieldMetaMsg> for pb_sync::FieldMeta {
    fn from(m: FieldMetaMsg) -> Self {
        Self { lamport: m.lamport, writer_device_id: m.writer_device_id }
    }
}

impl From<pb_sync::Operation> for OperationMsg {
    fn from(pb: pb_sync::Operation) -> Self {
        let kind: pb_sync::OpKind = pb.kind.try_into().unwrap_or(pb_sync::OpKind::Unspecified);
        Self {
            op_id: pb.op_id,
            device_id: pb.device_id,
            lamport: pb.lamport,
            collection: pb.collection,
            record_id: pb.record_id,
            kind: kind.into(),
            field_changes: pb.field_changes.into_iter().map(Into::into).collect(),
            base_clock: pb.base_clock.unwrap_or_default().into(),
            timestamp_ms: pb.timestamp_ms,
        }
    }
}
impl From<OperationMsg> for pb_sync::Operation {
    fn from(m: OperationMsg) -> Self {
        Self {
            op_id: m.op_id,
            device_id: m.device_id,
            lamport: m.lamport,
            collection: m.collection,
            record_id: m.record_id,
            kind: m.kind as i32,
            field_changes: m.field_changes.into_iter().map(Into::into).collect(),
            base_clock: Some(m.base_clock.into()),
            timestamp_ms: m.timestamp_ms,
        }
    }
}

impl From<pb_sync::OpAck> for OpAckMsg {
    fn from(pb: pb_sync::OpAck) -> Self {
        Self {
            op_id: pb.op_id,
            accepted: pb.accepted,
            error: pb.error.map(Into::into),
            revision: pb.revision,
        }
    }
}
impl From<OpAckMsg> for pb_sync::OpAck {
    fn from(m: OpAckMsg) -> Self {
        Self {
            op_id: m.op_id,
            accepted: m.accepted,
            error: m.error.map(Into::into),
            revision: m.revision,
        }
    }
}

impl From<pb_sync::SyncPush> for SyncPushMsg {
    fn from(pb: pb_sync::SyncPush) -> Self {
        Self { ops: pb.ops.into_iter().map(Into::into).collect() }
    }
}
impl From<SyncPushMsg> for pb_sync::SyncPush {
    fn from(m: SyncPushMsg) -> Self {
        Self { ops: m.ops.into_iter().map(Into::into).collect() }
    }
}

impl From<pb_sync::SyncPullRequest> for SyncPullRequestMsg {
    fn from(pb: pb_sync::SyncPullRequest) -> Self {
        Self { collection: pb.collection, since_lamport: pb.since_lamport, max_ops: pb.max_ops }
    }
}
impl From<SyncPullRequestMsg> for pb_sync::SyncPullRequest {
    fn from(m: SyncPullRequestMsg) -> Self {
        Self { collection: m.collection, since_lamport: m.since_lamport, max_ops: m.max_ops }
    }
}

impl From<pb_sync::SyncPullResponse> for SyncPullResponseMsg {
    fn from(pb: pb_sync::SyncPullResponse) -> Self {
        Self {
            collection: pb.collection,
            since_lamport: pb.since_lamport,
            ops: pb.ops.into_iter().map(Into::into).collect(),
            has_more: pb.has_more,
        }
    }
}
impl From<SyncPullResponseMsg> for pb_sync::SyncPullResponse {
    fn from(m: SyncPullResponseMsg) -> Self {
        Self {
            collection: m.collection,
            since_lamport: m.since_lamport,
            ops: m.ops.into_iter().map(Into::into).collect(),
            has_more: m.has_more,
        }
    }
}

impl From<pb_sync::Snapshot> for SnapshotMsg {
    fn from(pb: pb_sync::Snapshot) -> Self {
        Self {
            collection: pb.collection,
            revision: pb.revision,
            lamport_floor: pb.lamport_floor,
            records: pb.records.into_iter().map(Into::into).collect(),
        }
    }
}
impl From<SnapshotMsg> for pb_sync::Snapshot {
    fn from(m: SnapshotMsg) -> Self {
        Self {
            collection: m.collection,
            revision: m.revision,
            lamport_floor: m.lamport_floor,
            records: m.records.into_iter().map(Into::into).collect(),
        }
    }
}

impl From<pb_sync::Record> for RecordMsg {
    fn from(pb: pb_sync::Record) -> Self {
        Self {
            collection: pb.collection,
            record_id: pb.record_id,
            revision: pb.revision,
            vector_clock: pb.vector_clock.unwrap_or_default().into(),
            tombstone: pb.tombstone,
            fields: pb.fields.into_iter().map(|(k, v)| (k, Value::from(v))).collect(),
            field_meta: pb.field_meta.into_iter().map(|(k, v)| (k, v.into())).collect(),
            updated_at_ms: pb.updated_at_ms,
        }
    }
}
impl From<RecordMsg> for pb_sync::Record {
    fn from(m: RecordMsg) -> Self {
        Self {
            collection: m.collection,
            record_id: m.record_id,
            revision: m.revision,
            vector_clock: Some(m.vector_clock.into()),
            tombstone: m.tombstone,
            fields: m.fields.into_iter().map(|(k, v)| (k, common::Value::from(v))).collect(),
            field_meta: m.field_meta.into_iter().map(|(k, v)| (k, v.into())).collect(),
            updated_at_ms: m.updated_at_ms,
        }
    }
}

// Subscribe / Unsubscribe
impl From<pb_sync::Subscribe> for SubscribeMsg {
    fn from(pb: pb_sync::Subscribe) -> Self {
        Self {
            subscription_id: pb.subscription_id,
            collection: pb.collection,
            predicate: pb.predicate.map(crate::predicate::Predicate::from_prost),
            limit: pb.limit,
            with_snapshot: pb.with_snapshot,
        }
    }
}
impl From<SubscribeMsg> for pb_sync::Subscribe {
    fn from(m: SubscribeMsg) -> Self {
        let pred = m.predicate.as_ref().map(crate::predicate::Predicate::to_prost);
        Self {
            subscription_id: m.subscription_id,
            collection: m.collection,
            predicate: pred,
            limit: m.limit,
            with_snapshot: m.with_snapshot,
        }
    }
}
impl From<pb_sync::Unsubscribe> for UnsubscribeMsg {
    fn from(pb: pb_sync::Unsubscribe) -> Self {
        Self { subscription_id: pb.subscription_id }
    }
}
impl From<UnsubscribeMsg> for pb_sync::Unsubscribe {
    fn from(m: UnsubscribeMsg) -> Self {
        Self { subscription_id: m.subscription_id }
    }
}
impl From<pb_sync::SubscribeAck> for SubscribeAckMsg {
    fn from(pb: pb_sync::SubscribeAck) -> Self {
        Self {
            subscription_id: pb.subscription_id,
            accepted: pb.accepted,
            error: pb.error.map(Into::into),
            snapshot_revision: pb.snapshot_revision,
        }
    }
}
impl From<SubscribeAckMsg> for pb_sync::SubscribeAck {
    fn from(m: SubscribeAckMsg) -> Self {
        Self {
            subscription_id: m.subscription_id,
            accepted: m.accepted,
            error: m.error.map(Into::into),
            snapshot_revision: m.snapshot_revision,
        }
    }
}

use prost::Message;
use crate::gen::common;
