# OSP v1 Design — OWL Sync Protocol

**Date:** 2026-06-09
**Status:** Architecture Frozen
**Author:** Brainstorming session

---

## 1. Goals

OSP v1 is a binary, language-agnostic sync protocol built directly on TCP/TLS. It provides:

- Realtime + offline-first sync
- Multi-platform client SDKs (Rust, Dart, Node.js, Python, PHP, Go)
- Binary wire format (Protocol Buffers)
- Multi-connection multiplexing
- Auto-reconnect with idempotent replay
- Snapshot + delta sync
- Compression and chunking
- Authentication
- Encryption in transit (TLS)

It is explicitly **not** in v1: CRDT, WebSocket gateway, QUIC, clustering, multi-region replication, automatic resurrection, per-field vector clocks.

---

## 2. Layering

```
OwlClient SDK   |   OwlServer
        │
        ▼
   owl-sync            (engine: op gen, merge, replay, subs)
        │
        ▼
   owl-query           (filtering, query subs, indexing)
        │
        ▼
   owl-protocol        (Protobuf msgs, opcodes, contracts)
        │
        ▼
   owl-types           (DeviceId, VectorClock, Lamport, ...)
        │
        ▼
   owl-transport       (frame parse, TCP/TLS, heartbeat, reconnect)
        │
        ▼
   TCP / TLS
```

`owl-storage`, `owl-auth`, `owl-codegen`, `owl-cluster` (FASE 2) are orthogonal.

---

## 3. Dependency Rules (strict, no cycles)

| Crate          | Depends on                                          |
| -------------- | --------------------------------------------------- |
| owl-types      | (none)                                              |
| owl-transport  | (none — no OSP domain deps)                         |
| owl-protocol   | owl-types                                           |
| owl-storage    | owl-types                                           |
| owl-query      | owl-types                                           |
| owl-auth       | owl-types                                           |
| owl-sync       | owl-protocol, owl-types, owl-storage                |
| owl-server     | owl-sync, owl-storage, owl-auth, owl-protocol, owl-transport, owl-query |
| owl-client     | owl-sync, owl-storage, owl-auth, owl-protocol, owl-transport, owl-query |
| owl-codegen    | (standalone tool)                                   |
| owl-cli        | owl-client, owl-server                              |
| owl-cluster    | (FASE 2 — not in v1)                                |

`owl-protocol` MUST NOT depend on `owl-transport`. The protocol defines the contract; the transport is one of several possible carriers (TCP, WebSocket, QUIC, in-process).

---

## 4. Workspace Layout

```
owl/
├── crates/
│   ├── owl-types/
│   ├── owl-transport/
│   ├── owl-protocol/
│   ├── owl-storage/
│   ├── owl-query/
│   ├── owl-sync/
│   ├── owl-auth/
│   ├── owl-server/
│   ├── owl-client/
│   ├── owl-codegen/
│   ├── owl-cli/
│   └── owl-cluster/        (Phase 2)
├── proto/
│   └── osp/v1/
├── bindings/
│   ├── templates/
│   ├── configs/
│   └── generators/
├── examples/
├── docs/
│   └── superpowers/specs/
└── Cargo.toml              (workspace)
```

---

## 5. Wire Protocol

### 5.1 Transport

TCP with optional TLS 1.3 (`tokio-rustls`). One logical session per TCP connection. Multiplexing of logical streams is **not** in v1 — clients that need it open multiple TCP connections.

### 5.2 Frame Header (22 bytes, big-endian)

| Offset | Size | Field       |
| ------ | ---- | ----------- |
| 0      | 4    | MAGIC       |
| 4      | 2    | VERSION     |
| 6      | 2    | OPCODE      |
| 8      | 2    | FLAGS       |
| 10     | 4    | LEN         |
| 14     | 8    | REQ_ID      |

- `MAGIC` = `"OWL1"` (`4F 57 4C 31`)
- `VERSION` = `1` (wire protocol version, independent of SDK)
- `LEN` = payload length, max 16 MiB (larger payloads use chunking)
- `REQ_ID` = monotonic per direction, used only for ACK matching and request tracking. Never used as op_id seed.

### 5.3 Opcodes

| Code  | Name         | Direction         |
| ----- | ------------ | ----------------- |
| 0x01  | HELLO        | client → server   |
| 0x02  | HELLO_ACK    | server → client   |
| 0x03  | AUTH         | client → server   |
| 0x04  | AUTH_OK      | server → client   |
| 0x05  | AUTH_FAILED  | server → client   |
| 0x06  | SUBSCRIBE    | client → server   |
| 0x07  | SUBSCRIBE_ACK| server → client   |
| 0x08  | UNSUBSCRIBE  | client → server   |
| 0x09  | PATCH        | bidirectional     |
| 0x0A  | DELETE       | bidirectional     |
| 0x0B  | RESTORE      | bidirectional     |
| 0x0C  | SYNC         | server → client   |
| 0x0D  | ACK          | bidirectional     |
| 0x0E  | HEARTBEAT    | bidirectional     |
| 0x0F  | ERROR        | server → client   |
| 0x10  | PRESENCE     | bidirectional     |
| 0x11  | PING         | bidirectional     |
| 0x12  | PONG         | bidirectional     |

### 5.4 Flags

| Bit | Name        | Meaning                                  |
| --- | ----------- | ---------------------------------------- |
| 0   | COMPRESSED  | Payload is zstd-compressed               |
| 1   | CHUNK       | First/intermediate chunk; first 4 bytes of payload are CHUNK_ID |
| 2   | CHUNK_LAST  | Final chunk of a fragmented message      |
| 3-15| reserved    |                                          |

`ENCRYPTED_PAYLOAD` is **not** a flag. TLS provides transport encryption; future E2EE will be a separate protocol extension.

### 5.5 Payload

Protocol Buffers. Schema lives under `proto/osp/v1/`.

### 5.6 Heartbeat & Reconnect

- Server sends HEARTBEAT every `heartbeat_interval` (default 15s).
- 3 missed heartbeats → client treats connection as dead, runs `ReconnectStrategy` (exponential backoff 1s/2s/4s/8s/15s/30s, jittered).
- On reconnect, client sends HELLO with same `device_id` and `last_lamport_seen` per collection. Server replays missed snapshot+delta. Idempotency by `op_id` (UUIDv7).

### 5.7 Capability Negotiation

```
HELLO      { protocol_version, sdk_version, capabilities[] }
HELLO_ACK  { selected_capabilities[] }
```

Recognised capabilities: `compression_zstd`, `chunking`, `resume`, `presence`. If client offers a capability and server doesn't select it, both sides must support a no-capability fallback (e.g. uncompressed frames).

---

## 6. Sync Engine

### 6.1 Data Model

A `Record` is the unit of sync:

```rust
struct Record {
    id: RecordId,
    revision: Revision,        // server-assigned, increments on every mutation
    vector_clock: VectorClock, // record-level only
    fields: BTreeMap<String, FieldValue>,
    tombstone: bool,
}

struct FieldValue {
    value: Value,
    meta: FieldMeta,
}

struct FieldMeta {
    lamport: Lamport,
    writer: DeviceId,
}
```

A `Collection` is a named set of records. A `Device` is identified by `DeviceId(Uuid)`.

### 6.2 Operation

```rust
struct Operation {
    op_id: OpId,                  // UUIDv7
    device_id: DeviceId,
    lamport: Lamport,
    target: (CollectionId, RecordId),
    kind: OpKind,                 // Insert | Update | Delete | Restore
    field_changes: Vec<FieldChange>,
}
```

`UUIDv7` is time-ordered, k-sortable, and uniquely identifies an op for idempotent replay.

### 6.3 Op Generation (client side)

1. Caller mutates a record locally.
2. Client generates `op_id = uuid7()`, increments its entry in the local vector clock, sets `lamport = max(local_lamport, last_recv_lamport) + 1`.
3. Op is enqueued in `OpLogStore` and dispatched to the server.
4. On server ACK, the op is marked acked.

### 6.4 Merge (apply remote op)

For `Insert`/`Update`:
- For each field in `field_changes`:
  - Compare `(incoming_field.meta.lamport, incoming_field.meta.writer)` vs `(local_field.meta.lamport, local_field.meta.writer)`.
  - Higher (lexicographic) wins.
- If incoming write dominates the record's `vector_clock` for any field, update that field. Otherwise no-op (idempotent).
- Always update record's `vector_clock = local_clock.merge(&op_clocks)`.
- If the record is tombstoned, reject `Insert`/`Update` (server enforces; client enforces when no server reachable).

For `Delete`:
- Write a tombstone (`tombstone = true`) regardless of existing fields.
- Record remains in storage with `tombstone = true`. `Restore` is the only way to undelete.

For `Restore`:
- Clear `tombstone = false`. Subsequent field writes proceed normally. Vector clock merges.

### 6.5 Tombstone Semantics

**Permanent.** No automatic resurrection. Restoration is an explicit `Restore` op. This is a deliberate trade-off: business systems suffer more from accidental resurrection than from permanent deletion.

### 6.6 Replay Idempotency

- `OpLogStore::has_op(op_id)` is the dedup primitive.
- Both client (before applying) and server (before accepting) check.
- Re-sending the same op (e.g. after reconnect) is a no-op server-side.

### 6.7 Snapshot + Delta

- Server periodically writes a snapshot of a collection (full record set + clock) to `SnapshotStore`.
- New client subscribes → server sends `SYNC` containing the latest snapshot for the collection.
- Client applies snapshot, then requests `op_log_since(snapshot.lamport)`.
- Server streams matching ops from `OpLogStore`.
- New clients never replay the full operation history.

### 6.8 Subscriptions

A subscription is a `Query` + a `last_lamport` cursor. Server fans out matching ops to subscribers. Filters are server-side (see §7).

---

## 7. Query Layer

```rust
enum Predicate {
    Eq(FieldName, Value),
    Ne(FieldName, Value),
    Lt(FieldName, Value),
    Le(FieldName, Value),
    Gt(FieldName, Value),
    Ge(FieldName, Value),
    In(FieldName, Vec<Value>),
    And(Vec<Predicate>),
    Or(Vec<Predicate>),
    Not(Box<Predicate>),
}

struct Query {
    collection: CollectionId,
    filter: Option<Predicate>,
    sort: Vec<(FieldName, SortDir)>,
    limit: Option<u32>,
    after: Option<RecordId>,
}

trait Index {
    fn matches(&self, query: &Query, record: &Record) -> bool;
}
```

`owl-query` provides pure-Rust evaluation; server uses indexes for selective push.

---

## 8. Storage

Three orthogonal traits (different scaling characteristics, may use different backends):

```rust
#[async_trait]
trait RecordStore: Send + Sync {
    async fn put_record(&self, coll: &CollectionId, rec: &Record) -> Result<()>;
    async fn get_record(&self, coll: &CollectionId, id: &RecordId) -> Result<Option<Record>>;
    async fn delete_record(&self, coll: &CollectionId, id: &RecordId) -> Result<()>;
    async fn list_collection(&self, coll: &CollectionId, q: &Query) -> Result<Vec<Record>>;
}

#[async_trait]
trait OpLogStore: Send + Sync {
    async fn append_op(&self, op: &Operation) -> Result<()>;
    async fn has_op(&self, op_id: &OpId) -> Result<bool>;
    async fn op_log_since(&self, coll: &CollectionId, since: Lamport) -> Result<Vec<Operation>>;
}

#[async_trait]
trait SnapshotStore: Send + Sync {
    async fn save_snapshot(&self, coll: &CollectionId, snap: &Snapshot) -> Result<()>;
    async fn load_snapshot(&self, coll: &CollectionId, version: Revision) -> Result<Option<Snapshot>>;
    async fn latest_snapshot(&self, coll: &CollectionId) -> Result<Option<Snapshot>>;
}
```

Default backend: **SQLite** (via `sqlx`), implementing all three traits in one DB with separate tables.

Future backends: RocksDB, S3 snapshot store, distributed op-log.

---

## 9. Crate Plan (this session)

This session implements **Stages 0–6**:

| Stage | Crate           | Output                              |
| ----- | --------------- | ----------------------------------- |
| 0     | workspace       | `Cargo.toml`, dir tree, `proto/`    |
| 1     | owl-types       | Newtype IDs, VectorClock            |
| 2     | owl-transport   | Frame, Tcp, TLS, Heartbeat, Reconnect |
| 3     | owl-protocol    | Protobuf messages + dispatch        |
| 4     | owl-storage     | 3 traits + Sqlite + Memory          |
| 5     | owl-query       | Predicate, Query, Matcher           |
| 6     | owl-sync        | Op gen, Merge, Replay, Snapshot     |

Stages 7–13 (`owl-auth`, `owl-server`, `owl-client`, `owl-codegen`, `owl-cli`, `examples/`, `bindings/`) are specified in §10 and implemented in subsequent sessions.

---

## 10. Deferred Stages

- **Stage 7 — owl-auth:** JWT (HS256/RS256) and API key validators.
- **Stage 8 — owl-server:** Connection lifecycle, op routing, fan-out, snapshot scheduler.
- **Stage 9 — owl-client:** High-level `OwlClient` builder + auto-reconnect.
- **Stage 10 — owl-codegen:** `.proto` → Rust / Dart / Node.js / Python / PHP / Go stubs.
- **Stage 11 — owl-cli:** `owl server`, `owl client`, `owl codegen`.
- **Stage 12 — examples/:** chat, todo, multi-device.
- **Stage 13 — bindings skeleton:** compile-only stubs for all target languages.
- **Stage 14 — owl-cluster (FASE 2):** inter-node replication, multi-region.

---

## 11. Test Strategy

Each crate has unit tests embedded alongside source. Critical correctness tests:

- **owl-types:** vector clock merge is associative + commutative; dominance is antisymmetric; concurrent detection is symmetric.
- **owl-transport:** header round-trip, chunking reassembly, heartbeat miss triggers close, reconnect resume.
- **owl-protocol:** encode/decode round-trip for every opcode.
- **owl-storage:** idempotent append, snapshot+delta replay converges to same state as full replay.
- **owl-query:** AND/OR/NOT composition, sort+limit pagination.
- **owl-sync:** two-device offline merge; concurrent same-field LWW tiebreaker by device_id; tombstone persists; replay dedup by op_id; snapshot+delta matches full replay.

End-to-end (Stage 8+) adds: two clients sync via server, server reboot + client resume.

---

## 12. Open Questions (none for v1)

All major decisions are frozen. Minor items (exact heartbeat defaults, snapshot cadence, SQL schema) are implementation-level and will be tuned during Stage 8/9 with measurements.
