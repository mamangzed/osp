# @owl/osp — Node.js SDK

OWL Sync Protocol (OSP) Node.js SDK. Provides offline-first, real-time data synchronization with conflict resolution, designed for multi-device applications.

## Features

- **Offline-first**: Local mutations are durable and replay on reconnect.
- **Conflict Resolution**: Last-Write-Wins (LWW) with Vector Clocks and `(lamport, device_id)` tiebreakers.
- **Binary Wire Protocol**: 22-byte fixed header + JSON payload (compatible with OSP v1).
- **Auto-reconnect**: Exponential backoff with jitter.
- **Idempotent Replay**: UUIDv7 operation IDs prevent duplicate application.
- **Tombstone Semantics**: Permanent deletion with explicit `Restore` operations.
- **Query Subscriptions**: Server-side filtering with predicate support.

## Installation

```bash
npm install @owl/osp
# or
yarn add @owl/osp
# or
pnpm add @owl/osp
```

## Quickstart

### 1. Start a Server

```typescript
import { OwlServer } from '@owl/osp';

const server = new OwlServer({
  port: 9420,
  host: '127.0.0.1',
  heartbeatIntervalMs: 15000,
  // Optional: Custom JWT or API key validation
  validateToken: (token) => {
    if (token === 'my-secret-token') {
      return { valid: true, deviceId: 'server-device', scopes: ['*'] };
    }
    return { valid: false };
  },
});

await server.listen();
console.log('🦉 OSP Server listening on port 9420');
```

### 2. Connect a Client

```typescript
import { OwlClient } from '@owl/osp';

const client = new OwlClient({
  url: 'tcp://127.0.0.1:9420', // Use 'tls://' for encrypted connections
  token: 'my-secret-token',
  deviceId: 'client-device-1', // Optional: defaults to UUIDv4
});

await client.connect();

// Set a field
await client.set('users', 'user-123', 'name', 'Alice');
await client.set('users', 'user-123', 'age', 30);

// Get a record
const record = client.get('users', 'user-123');
console.log(record?.fields); // { name: 'Alice', age: 30 }

// Delete a record (creates a permanent tombstone)
await client.delete('users', 'user-123');

// Restore a tombstoned record
await client.restore('users', 'user-123');

// Subscribe to changes with a predicate filter
const subId = await client.subscribe('users', {
  kind: 'eq',
  field: 'age',
  value: 30,
}, true); // true = request snapshot on subscribe

// Later, unsubscribe
await client.unsubscribe(subId);

// Disconnect
client.disconnect();
```

## API Reference

### `OwlClient`

| Method | Description |
|---|---|
| `connect()` | Establishes TCP/TLS connection, runs HELLO + AUTH handshake, starts heartbeat. |
| `disconnect()` | Closes connection and stops background loops. |
| `set(coll, recordId, field, value)` | Generates a local update operation, applies it, and pushes to server. |
| `delete(coll, recordId)` | Tombstones the record locally and pushes delete op. |
| `restore(coll, recordId)` | Clears tombstone locally and pushes restore op. |
| `get(coll, recordId)` | Returns the locally cached `RecordMsg` or `null`. |
| `subscribe(coll, predicate?, withSnapshot?)` | Subscribes to a collection. Returns `subscriptionId`. |
| `unsubscribe(subscriptionId)` | Cancels an active subscription. |

### `OwlServer`

| Option | Type | Description |
|---|---|---|
| `port` | `number` | Port to listen on. |
| `host` | `string` | Host to bind to (default: `'0.0.0.0'`). |
| `heartbeatIntervalMs` | `number` | Interval for sending PING/PONG (default: `15000`). |
| `validateToken` | `(token: string) => { valid: boolean, deviceId?: string, scopes?: string[] }` | Auth validator. Return `valid: true` to accept. |

### `SyncEngine` (Standalone)

You can use the sync engine independently of the network layer for pure offline-first local state management:

```typescript
import { SyncEngine, VectorClockImpl } from '@owl/osp';

const engine = new SyncEngine('my-device-id');

// Local mutations
engine.localSetField('todos', 'todo-1', 'title', 'Buy milk');
engine.localDelete('todos', 'todo-1');

// Apply remote operations (e.g., received from another client)
const applied = engine.applyRemote(remoteOp);

// Query
const record = engine.getRecord('todos', 'todo-1');
const allTodos = engine.listRecords('todos', { kind: 'eq', field: 'status', value: 'active' });
```

## Sync Semantics

### Conflict Resolution (LWW)
When two devices update the same field concurrently, OSP uses **Last-Write-Wins** based on a lexicographical comparison of `(lamport_timestamp, device_id)`.
1. Higher `lamport` wins.
2. If `lamport` is equal, the lexicographically larger `device_id` wins.
This ensures deterministic convergence across all nodes without coordination.

### Vector Clocks
Every record maintains a per-record Vector Clock. When an operation is applied, the local vector clock is merged with the operation's `base_clock`. This tracks causality and prevents older operations from overwriting newer ones.

### Tombstones
`delete()` does not remove data; it sets `tombstone = true`. This tombstone is permanent and syncs across devices. The only way to make a record visible again is via an explicit `restore()` operation. This prevents accidental resurrection of deleted data during offline replay.

### Idempotent Replay
Every operation is assigned a UUIDv7 `op_id`. The engine maintains an `OpLog` of seen `op_id`s. If `applyRemote()` receives an operation it has already processed, it returns `false` and performs no action, ensuring safe retries after network partitions.

## Wire Protocol

The SDK implements the OSP v1 wire format:
- **Header**: 22 bytes (MAGIC `"OWL1"`, VERSION `1`, OPCODE, FLAGS, LENGTH, REQ_ID).
- **Payload**: JSON-stringified `Envelope` object (designed to be wire-compatible with the Rust Protobuf schema via field mapping).
- **Chunking**: Payloads > 16 MiB are automatically split into chunks with `FLAG_CHUNK` and `FLAG_CHUNK_LAST`.
- **Compression**: Supports `zstd` compression (requires `@mongodb-js/zstd` if enabled in capabilities).

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test
```

## License

MIT