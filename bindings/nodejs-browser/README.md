# @owl/osp-browser — Browser SDK

OWL Sync Protocol (OSP) Browser SDK. Provides offline-first, real-time data synchronization for web applications using **WebSocket**.

## Features

- **WebSocket Native**: Uses browser `WebSocket` API (no raw TCP).
- **Same Wire Protocol**: 22-byte header + JSON payload, identical to Node.js/Rust SDKs.
- **Offline-first**: Local mutations are durable in memory and replay on reconnect.
- **Conflict Resolution**: Last-Write-Wins (LWW) with Vector Clocks.
- **Idempotent Replay**: UUIDv7 operation IDs prevent duplicate application.

## Installation

```bash
npm install @owl/osp-browser
# or
yarn add @owl/osp-browser
# or
pnpm add @owl/osp-browser
```

## Quickstart

```typescript
import { OwlClient } from '@owl/osp-browser';

const client = new OwlClient({
  url: 'ws://127.0.0.1:9421', // Use 'wss://' for production
  token: 'my-secret-token',
  deviceId: 'browser-device-1', // Optional: defaults to UUIDv4
});

// Optional: Listen to real-time updates
client.onOpReceived = (op) => {
  console.log('Received op:', op);
  // Update your UI framework state here (React, Vue, etc.)
};

client.onDisconnected = () => {
  console.log('Disconnected from server');
};

await client.connect();

// Set a field
await client.set('users', 'user-123', 'name', 'Alice');

// Get a record
const record = client.get('users', 'user-123');
console.log(record?.fields); // { name: 'Alice' }

// Subscribe to changes
const subId = await client.subscribe('users', {
  kind: 'eq',
  field: 'name',
  value: 'Alice',
}, true);

// Disconnect
client.disconnect();
```

## API Reference

| Method | Description |
|---|---|
| `connect()` | Establishes WebSocket connection, runs HELLO + AUTH handshake. |
| `disconnect()` | Closes WebSocket connection. |
| `set(coll, recordId, field, value)` | Generates local update, applies it, pushes to server. |
| `delete(coll, recordId)` | Tombstones record locally, pushes delete op. |
| `restore(coll, recordId)` | Clears tombstone locally, pushes restore op. |
| `get(coll, recordId)` | Returns locally cached `RecordMsg` or `null`. |
| `subscribe(coll, predicate?, withSnapshot?)` | Subscribes to collection. Returns `subscriptionId`. |
| `unsubscribe(subscriptionId)` | Cancels active subscription. |

## Browser Limitations

- **No Raw TCP**: Browser security model prohibits raw TCP. This SDK uses WebSocket exclusively.
- **No zstd Compression**: Browsers lack native zstd. The `CompressionZstd` capability is omitted from browser client hello. Use server-side compression if needed.
- **In-Memory Only**: Browser SDK does not persist to IndexedDB/LocalStorage by default (to keep bundle size small). For true offline persistence, wrap the `SyncEngine` with your own storage layer.

## Architecture

```text
[Browser App] 
   │ (WebSocket: binary frames)
   ▼
[OSP Server (Node.js / Rust)] 
   │ (Raw TCP or WebSocket)
   ▼
[Database / Storage]
```

## Development

```bash
npm install
npm run build
```

## License

MIT