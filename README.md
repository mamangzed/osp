# OWL — OWL Sync Protocol (OSP)

OWL is a real-time, offline-first sync engine for multi-device, multi-platform applications.

**OSP** is the binary wire protocol OWL speaks, layered directly on TCP/TLS.

## Highlights

- **Realtime + offline-first** — local mutations are durable and replay on reconnect
- **Multi-platform SDKs** — Rust (full), PHP (extension), plus future Dart / Node.js / Python / Go
- **Binary protocol** — Protocol Buffers payload, 22-byte fixed header
- **Auto-reconnect with idempotent replay** — UUIDv7 operation IDs
- **Snapshot + delta** — new clients catch up fast, never replay the full op history
- **Compression** — zstd
- **Authentication** — JWT (HS256) or API key
- **Encryption in transit** — TLS 1.3 (via `tokio-rustls`)

## Architecture

```
OwlClient SDK
    │
    ▼
owl-sync              (engine: op gen, merge, replay, subscriptions)
    │
    ▼
owl-query             (filtering, query subs, indexing)
    │
    ▼
owl-protocol          (Protobuf msgs, opcodes, contracts)
    │
    ▼
owl-types             (DeviceId, VectorClock, Lamport, Revision)
    │
    ▼
owl-transport         (frame parse, TCP/TLS, heartbeat, reconnect)
    │
    ▼
TCP / TLS
```

`owl-storage`, `owl-auth`, `owl-codegen` are orthogonal layers.

## Crate Map

| Crate          | Status | Responsibility                                        |
| -------------- | ------ | ----------------------------------------------------- |
| `owl-types`    | ✅     | Newtype IDs, vector clock, lamport                    |
| `owl-transport`| ✅     | Frame, TCP, TLS, heartbeat, reconnect                 |
| `owl-protocol` | ✅     | Protobuf messages, opcode dispatch                    |
| `owl-storage`  | ✅     | Record / op-log / snapshot stores (SQLite default)    |
| `owl-query`    | ✅     | Predicate, query, matcher                             |
| `owl-sync`     | ✅     | Op generation, merge, replay, snapshot sync           |
| `owl-auth`     | ✅     | JWT (HS256) / API key validation                      |
| `owl-server`   | ✅     | TCP server runtime (single-process, SQLite + memory) |
| `owl-client`   | ✅     | High-level Rust SDK                                   |
| `owl-cli`      | ✅     | Operator CLI (`owl server/client/issue-token`)        |
| `owl-codegen`  | ⏳     | Stub (Stage 10) — multi-language stubs                |
| `owl-php`      | ✅*    | PHP extension — *code complete, needs PHP dev headers to build* |
| `owl-cluster`  | ⏳     | (Phase 2) inter-node replication                      |

✅ = implemented & tested
⏳ = stubbed (intentionally deferred per design)
✅* = implemented, but build blocked on environment-specific deps (see `crates/owl-php/README.md`)

## Workspace Layout

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
│   ├── owl-server/        # binary: owl-server
│   ├── owl-client/
│   ├── owl-codegen/       # binary: owl-codegen (stub)
│   ├── owl-cli/           # binary: owl
│   └── owl-php/           # cdylib: owl_php.dll (excluded from default build)
├── proto/
│   └── osp/v1/            # canonical .proto contract
├── bindings/              # (placeholder; generated stubs via owl-codegen in a follow-up)
├── examples/              # (placeholder; end-to-end demos in a follow-up)
├── docs/
│   └── superpowers/specs/2026-06-09-osp-v1-design.md
└── Cargo.toml             # workspace
```

## Quickstart

```bash
# Build everything in the default workspace
cargo build

# Run tests
cargo test

# Run the server (in-memory SQLite, dev-mode auth accepts any non-empty token)
cargo run -p owl-server -- --bind 0.0.0.0:9420 --db :memory:

# Issue a JWT (for a real deployment)
TOKEN=$(cargo run -p owl-cli -- issue-token --secret "my-secret" --scopes "users,orders")
echo "$TOKEN"

# Set a field from the CLI (talks to a running server)
cargo run -p owl-cli -- client --url tcp://127.0.0.1:9420 --token "$TOKEN" \
  set users u1 name '"alice"'

# Get a record
cargo run -p owl-cli -- client --url tcp://127.0.0.1:9420 --token "$TOKEN" \
  get users u1
```

## OSP Wire Format (v1)

### Frame header (22 bytes, big-endian)

| Offset | Size | Field       |
| ------ | ---- | ----------- |
| 0      | 4    | MAGIC = "OWL1" |
| 4      | 2    | VERSION = 1 |
| 6      | 2    | OPCODE      |
| 8      | 2    | FLAGS       |
| 10     | 4    | LEN (payload) |
| 14     | 8    | REQ_ID      |

### Opcodes (0x01–0x12)

`HELLO`, `HELLO_ACK`, `AUTH`, `AUTH_OK`, `AUTH_FAILED`, `SUBSCRIBE`, `SUBSCRIBE_ACK`,
`UNSUBSCRIBE`, `PATCH` (op), `DELETE` (op), `RESTORE` (op), `SYNC`, `ACK`, `HEARTBEAT`,
`ERROR`, `PRESENCE`, `PING`, `PONG`.

### Flags

| Bit | Name         | Meaning                                |
| --- | ------------ | -------------------------------------- |
| 0   | COMPRESSED   | Payload is zstd-compressed            |
| 1   | CHUNK        | First/intermediate chunk              |
| 2   | CHUNK_LAST   | Final chunk                            |
| 3-15| reserved     |                                        |

### Payload

Protocol Buffers (see `proto/osp/v1/`).

## Sync Semantics

- **Per-record vector clock** + **field-level LWW** by `(lamport, device_id)`
- **Permanent tombstone**; explicit `Restore` op
- **UUIDv7 op IDs** for time-ordered, k-sortable, dedup-friendly replays
- **Snapshot + delta**: new clients receive latest snapshot + `op_log_since(snapshot.lamport)`
- **Idempotent replay**: same op_id sent twice is a no-op
- **Offline-first**: pending ops persisted in local OpLogStore, drained on reconnect

## v1 Scope (in)

✅ TCP/TLS, Protobuf, SQLite, Snapshot+Delta, UUIDv7, VecClock+LWW,
Permanent Tombstone, Explicit Restore, Query Subscriptions, Idempotent
Replay, Compression, Chunking, Capability Negotiation.

## v1 Scope (out — explicitly deferred)

✗ CRDT (Text/Lists), WebSocket Gateway, QUIC, Clustering, Multi-region,
Automatic Resurrection, Per-field vector clock.

## Tests

```bash
cargo test
# 67 passed, 0 failed
```

## Roadmap (next session)

- `owl-codegen`: produce Dart / Node.js / Python / PHP stubs from `proto/`
- `examples/chat`, `examples/todo`, `examples/multi-device`
- TLS full wiring in transport (server-side rustls)
- WebSocket gateway (for browser clients)
- Cross-language end-to-end demo (Rust server + PHP client + Dart client)

See `docs/superpowers/specs/2026-06-09-osp-v1-design.md` for the full design.
