/**
 * OSP Types - Mirroring Rust structs (Browser SDK)
 */

export type CollectionId = string;
export type RecordId = string;
export type DeviceId = string;
export type OpId = string; // UUIDv7
export type SessionId = string;

export interface VectorClock {
  entries: Record<DeviceId, number>;
}

export interface FieldMeta {
  lamport: number;
  writer_device_id: DeviceId;
}

export type Value =
  | null
  | boolean
  | number
  | string
  | Uint8Array
  | Value[]
  | Record<string, Value>;

export interface FieldChange {
  field_name: string;
  new_value: Value | null;
  lamport: number;
  writer_device_id: DeviceId;
}

export enum OpKind {
  Unspecified = 0,
  Insert = 1,
  Update = 2,
  Delete = 3,
  Restore = 4,
}

export interface OperationMsg {
  op_id: OpId;
  device_id: DeviceId;
  lamport: number;
  collection: CollectionId;
  record_id: RecordId;
  kind: OpKind;
  field_changes: FieldChange[];
  base_clock: VectorClock;
  timestamp_ms: number;
}

export interface RecordMsg {
  collection: CollectionId;
  record_id: RecordId;
  revision: number;
  vector_clock: VectorClock;
  tombstone: boolean;
  fields: Record<string, Value>;
  field_meta: Record<string, FieldMeta>;
  updated_at_ms: number;
}

export interface FieldChangeMsg {
  field_name: string;
  new_value: Value | null;
  lamport: number;
  writer_device_id: DeviceId;
}

export enum Capability {
  Unspecified = 0,
  CompressionZstd = 1,
  Chunking = 2,
  Resume = 3,
  Presence = 4,
}

export interface HelloMsg {
  protocol_version: number;
  sdk_version: string;
  device_id: DeviceId;
  device_platform: string;
  capabilities: Capability[];
}

export interface HelloAckMsg {
  protocol_version: number;
  server_version: string;
  session_id: SessionId;
  heartbeat_interval_ms: number;
  selected_capabilities: Capability[];
  snapshot_window: number;
}

export interface AuthMsg {
  token: string;
}

export interface AuthOkMsg {
  device_id: DeviceId;
  collection_scopes: string[];
}

export interface AuthFailedMsg {
  code: number;
  message: string;
  detail: string;
}

export interface SubscribeMsg {
  subscription_id: string;
  collection: CollectionId;
  predicate: Predicate | null;
  limit: number;
  with_snapshot: boolean;
}

export interface UnsubscribeMsg {
  subscription_id: string;
}

export interface SubscribeAckMsg {
  subscription_id: string;
  accepted: boolean;
  error: ErrorMsg | null;
  snapshot_revision: number;
}

export interface OpAckMsg {
  op_id: OpId;
  accepted: boolean;
  error: ErrorMsg | null;
  revision: number;
}

export interface SyncPushMsg {
  ops: OperationMsg[];
}

export interface SyncPullRequestMsg {
  collection: CollectionId;
  since_lamport: number;
  max_ops: number;
}

export interface SyncPullResponseMsg {
  collection: CollectionId;
  since_lamport: number;
  ops: OperationMsg[];
  has_more: boolean;
}

export interface SnapshotMsg {
  collection: CollectionId;
  revision: number;
  lamport_floor: number;
  records: RecordMsg[];
}

export interface ErrorMsg {
  code: number;
  message: string;
  detail: string;
}

export interface PresenceMsg {
  device_id: DeviceId;
  status: number;
  lamport: number;
}

export enum PredicateKind {
  Eq = 'eq',
  Ne = 'ne',
  Lt = 'lt',
  Le = 'le',
  Gt = 'gt',
  Ge = 'ge',
  In = 'in',
  And = 'and',
  Or = 'or',
  Not = 'not',
}

export interface Predicate {
  kind: PredicateKind;
  field?: string;
  value?: Value;
  values?: Value[];
  children?: Predicate[];
  child?: Predicate;
}
