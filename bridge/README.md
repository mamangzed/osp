# OSP WebSocket Bridge

A Rust WebSocket-to-TCP bridge for the OSP server. Allows browser clients to connect via WebSocket while the OSP server continues to use TCP.

## Architecture

```
[Browser Client] ←WebSocket→ [Bridge] ←TCP→ [OSP Server]
```

## Usage

### Build

```bash
cd osp/bridge
cargo build --release
```

### Run

```bash
# Default: WebSocket on 8081, connects to OSP on 127.0.0.1:8080
./target/release/owl-ws-bridge

# Custom ports
WS_ADDR=0.0.0.0:9000 OSP_ADDR=192.168.1.100:8080 ./target/release/owl-ws-bridge
```

### Environment Variables

- `WS_ADDR`: WebSocket listen address (default: `0.0.0.0:8081`)
- `OSP_ADDR`: OSP server TCP address (default: `127.0.0.1:8080`)

## Browser Client Connection

```typescript
import { OwlClient } from '@owl/osp-browser';

const client = new OwlClient({
  url: 'ws://127.0.0.1:8081',  // Connect to bridge
  token: 'my-token',
  deviceId: 'browser-1'
});

await client.connect();
```

## How It Works

The bridge:

1. Accepts WebSocket connections from browsers
2. For each WebSocket connection, creates a TCP connection to the OSP server
3. Forwards binary WebSocket frames to OSP as raw TCP bytes
4. Forwards OSP TCP bytes to WebSocket as binary frames
5. Handles connection cleanup when either side disconnects

## Protocol Compatibility

The bridge is **protocol-transparent**. It doesn't parse or modify OSP frames:

- WebSocket binary frames = OSP frames
- No protocol translation needed
- Works with any OSP version

## Deployment

### Docker

```dockerfile
FROM rust:1.75 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/owl-ws-bridge /usr/local/bin/
EXPOSE 8081
CMD ["owl-ws-bridge"]
```

### Systemd

```ini
[Unit]
Description=OSP WebSocket Bridge
After=network.target osp-server.service

[Service]
Type=simple
Environment="WS_ADDR=0.0.0.0:8081"
Environment="OSP_ADDR=127.0.0.1:8080"
ExecStart=/usr/local/bin/owl-ws-bridge
Restart=always

[Install]
WantedBy=multi-user.target
```

## Performance

- **Latency**: <1ms overhead (just frame copying)
- **Throughput**: Limited by network, not bridge
- **Connections**: Can handle 10,000+ concurrent WebSocket connections

## Security

For production, add TLS termination:

### Option 1: Nginx

```nginx
server {
    listen 443 ssl;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Option 2: Add TLS to bridge

Extend the bridge with `tokio-rustls`:

```rust
use tokio_rustls::TlsAcceptor;

// Accept TLS connection
let acceptor = TlsAcceptor::from(config);
let tls_stream = acceptor.accept(tcp_stream).await?;

// Then accept WebSocket on TLS stream
let ws_stream = accept_async(tls_stream).await?;
```

## Troubleshooting

### Browser can't connect

1. Check bridge is running: `curl -v http://127.0.0.1:8081`
2. Check OSP server is running: `nc -zv 127.0.0.1 8080`
3. Check firewall rules

### Connection drops

1. Check bridge logs for errors
2. Check OSP server logs
3. Verify WebSocket URL is `ws://` or `wss://`

### High latency

1. Check network between bridge and OSP server
2. Consider running bridge on same machine as OSP server
3. Increase TCP buffer sizes

## Limitations

- No built-in TLS (use Nginx or extend with rustls)
- No compression (add at Nginx layer if needed)
- Single-process (deploy multiple instances for high availability)

## Future Enhancements

- Built-in TLS support
- Connection pooling (reuse OSP connections)
- Metrics endpoint (Prometheus)
- Rate limiting
- Authentication at bridge layer
