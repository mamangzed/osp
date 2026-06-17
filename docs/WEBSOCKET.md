# WebSocket Support in OSP

This document describes how to use WebSocket with the OWL Sync Protocol (OSP).

## Overview

OSP is **transport-agnostic**. The same 22-byte header + JSON payload format works over:
- Raw TCP (Node.js, Rust, Go, etc.)
- WebSocket (Browser clients, Node.js)
- Future: QUIC, Unix Domain Sockets

## Architecture Options

### Option 1: Node.js Server with Native WebSocket (Recommended for Node.js backends)

The Node.js `@owl/osp` SDK supports both TCP and WebSocket simultaneously.

```typescript
import { OwlServer } from '@owl/osp';

const server = new OwlServer({
  port: 8080,           // TCP port
  wsPort: 8081,         // WebSocket port
  heartbeatIntervalMs: 15000,
  validateToken: (token) => ({ valid: token === 'my-token' })
});

await server.listen();
```

**Clients:**
- Node.js: `tcp://127.0.0.1:8080`
- Browser: `ws://127.0.0.1:8081`

### Option 2: Rust OSP Server + WebSocket Bridge (Recommended for Rust backends)

The Rust OSP server currently supports TCP only. Use the provided WebSocket bridge.

```bash
# Start OSP server (TCP only)
cargo run -p owl-server -- --bind 0.0.0.0:8080

# Start WebSocket bridge
cd bridge
cargo run --release
```

**Architecture:**
```
[Browser Client] ←WebSocket→ [Bridge] ←TCP→ [Rust OSP Server]
```

### Option 3: Nginx/HAProxy WebSocket-to-TCP Proxy

Use a reverse proxy to convert WebSocket to TCP.

```nginx
server {
    listen 443 ssl;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Browser Client Usage

Install the browser SDK:

```bash
npm install @owl/osp-browser
```

Connect and use:

```typescript
import { OwlClient } from '@owl/osp-browser';

const client = new OwlClient({
  url: 'ws://127.0.0.1:8081',
  token: 'my-token',
  deviceId: 'browser-1'
});

await client.connect();

// Set a field
await client.set('todos', 'todo-1', 'title', 'Buy milk');

// Get a record
const record = client.get('todos', 'todo-1');
console.log(record?.fields);

// Subscribe to changes
await client.subscribe('todos');

// Disconnect
client.disconnect();
```

## Protocol Compatibility

The WebSocket transport uses the **exact same protocol** as TCP:

| Aspect | TCP | WebSocket |
|--------|-----|-----------|
| Header | 22 bytes (MAGIC, VERSION, OPCODE, FLAGS, LEN, REQ_ID) | 22 bytes |
| Payload | JSON stringified | JSON stringified |
| Chunking | Supported (FLAG_CHUNK, FLAG_CHUNK_LAST) | Supported |
| Compression | zstd | zstd (if available) |

The only difference is the framing:
- **TCP**: Raw bytes written to socket
- **WebSocket**: Binary frames (`ws.send(data, { binary: true })`)

## Browser SDK Limitations

1. **No zstd compression**: Browsers lack native zstd. The `CompressionZstd` capability is omitted from browser client hello.
2. **In-memory storage only**: No IndexedDB persistence by default (to keep bundle size small).
3. **WebSocket only**: No raw TCP support (browser security restriction).

## Deployment Examples

### Node.js Server

```typescript
// server.ts
import { OwlServer } from '@owl/osp';

const server = new OwlServer({
  port: 8080,
  wsPort: 8081,
  validateToken: async (token) => {
    // Verify JWT or API key
    return { valid: true, deviceId: 'user-1', scopes: ['*'] };
  }
});

await server.listen();
console.log('TCP: 127.0.0.1:8080, WS: ws://127.0.0.1:8081');
```

### Rust Server + Bridge

```bash
# Terminal 1: Start OSP server
cargo run -p owl-server -- --bind 0.0.0.0:8080

# Terminal 2: Start bridge
cd bridge
cargo run --release
```

### Docker Deployment

```dockerfile
# Dockerfile for bridge
FROM rust:1.75 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/owl-ws-bridge /usr/local/bin/
EXPOSE 8081
CMD ["owl-ws-bridge"]
```

## Troubleshooting

### Browser can't connect

1. Check bridge/server is running: `curl -v http://127.0.0.1:8081`
2. Check OSP server is running: `nc -zv 127.0.0.1 8080`
3. Verify WebSocket URL is `ws://` or `wss://`

### Connection drops

1. Check bridge logs for errors
2. Verify heartbeat interval is configured (default 15s)
3. Check firewall/proxy settings

### High latency

1. Run bridge on same machine as OSP server
2. Increase TCP buffer sizes
3. Consider native WebSocket support in Rust (see `WEBSOCKET.md` in repo root)

## Future: Native Rust WebSocket Support

Native WebSocket support in `owl-server` is planned for Phase 2. Until then, use the bridge or Node.js server.

See `WEBSOCKET.md` in the repo root for implementation details and options.
