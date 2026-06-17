# WebSocket Support

The OSP Node.js server now supports both TCP and WebSocket connections simultaneously.

## Server Configuration

```typescript
import { OwlServer } from '@owl/osp';

const server = new OwlServer({
  port: 8080,           // TCP port
  wsPort: 8081,         // WebSocket port (optional)
  heartbeatIntervalMs: 15000,
  validateToken: async (token) => {
    return { valid: token === 'my-token', deviceId: 'device-1' };
  }
});

await server.listen();
```

When `wsPort` is specified:
- TCP server listens on `port` (default: 8080)
- WebSocket server listens on `wsPort` (default: `port + 1`)

## Client Connection

### Node.js Client (TCP)
```typescript
import { OwlClient } from '@owl/osp';

const client = new OwlClient({
  url: 'tcp://127.0.0.1:8080',
  token: 'my-token',
  deviceId: 'node-client'
});
```

### Browser Client (WebSocket)
```typescript
import { OwlClient } from '@owl/osp-browser';

const client = new OwlClient({
  url: 'ws://127.0.0.1:8081',
  token: 'my-token',
  deviceId: 'browser-client'
});
```

### Browser Client (WebSocket with TLS)
```typescript
const client = new OwlClient({
  url: 'wss://example.com:8081',
  token: 'my-token',
  deviceId: 'browser-client'
});
```

## How It Works

The WebSocket server wraps the browser's `WebSocket` object to be compatible with the internal `Connection` interface:

```typescript
// WebSocket → Connection adapter
const socketLike = {
  on: (event: string, cb: any) => {
    if (event === 'data') {
      ws.on('message', (data: Buffer | ArrayBuffer) => cb(Buffer.from(data)));
    }
    if (event === 'end') {
      ws.on('close', cb);
    }
    if (event === 'error') {
      ws.on('error', cb);
    }
  },
  write: (data: Buffer, cb?: () => void) => {
    ws.send(data, { binary: true }, cb);
  },
  end: () => ws.close(),
  setNoDelay: () => {} // WebSocket already optimal
};
```

This allows the same session handling, operation validation, and fan-out logic to work for both TCP and WebSocket clients.

## Protocol Compatibility

Both TCP and WebSocket use the same binary protocol:
- 22-byte header (magic + length + opcode + req_id)
- JSON payload (same schema as TCP)
- Chunking support
- Compression support (zstd)

The only difference is the transport layer:
- **TCP**: Raw binary stream over TCP socket
- **WebSocket**: Binary frames over WebSocket protocol

## Running the Demo

1. Start the server:
```bash
cd bindings/nodejs/examples
npx ts-node websocket-server.ts
```

2. Open `browser-client.html` in a browser

3. Connect to `ws://127.0.0.1:8081` with token `demo-token`

4. Try setting fields, deleting records, and subscribing to collections

## Browser SDK Limitations

The browser SDK (`@owl/osp-browser`) has some limitations compared to the Node.js SDK:

1. **No zstd compression**: Browser doesn't have native zstd support
2. **In-memory storage only**: No IndexedDB persistence
3. **WebSocket only**: No raw TCP support

These are acceptable trade-offs for browser environments.

## WebSocket Gateway Pattern

For production deployments, you can also use a WebSocket-to-TCP bridge:

```typescript
// bridge.ts
import { WebSocketServer } from 'ws';
import { Connection } from '@owl/osp';
import { createTcpConnection } from './tcp-bridge';

const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', (ws) => {
  // Connect to OSP server via TCP
  const tcpConn = createTcpConnection('127.0.0.1', 8080);

  // Bridge WebSocket ↔ TCP
  ws.on('message', (data) => tcpConn.write(data));
  tcpConn.on('data', (data) => ws.send(data, { binary: true }));

  ws.on('close', () => tcpConn.end());
  tcpConn.on('end', () => ws.close());
});
```

This pattern is useful when:
- OSP server doesn't support WebSocket natively
- You want to separate WebSocket handling from sync logic
- You're using a Rust OSP server (which currently only supports TCP)
