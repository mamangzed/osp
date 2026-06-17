# WebSocket Support for OSP Rust Server

## Current Status

The OSP Rust implementation currently supports **TCP only**. WebSocket support would require adding a new transport layer.

## Implementation Options

### Option 1: Native WebSocket Support in owl-server

Add WebSocket as a first-class transport alongside TCP.

#### Required Changes

1. **Add dependencies to `owl-server/Cargo.toml`**:
```toml
[dependencies]
tokio-tungstenite = "0.21"
futures-util = "0.3"
```

2. **Create WebSocket transport in `owl-transport`**:
```rust
// owl-transport/src/websocket.rs
use tokio_tungstenite::{accept_async, tungstenite::Message};
use tokio::net::TcpStream;

pub struct WebSocketConnection {
    ws: WebSocketStream<TcpStream>,
}

impl WebSocketConnection {
    pub async fn accept(stream: TcpStream) -> Result<Self, Error> {
        let ws = accept_async(stream).await?;
        Ok(Self { ws })
    }
    
    pub async fn read_frame(&mut self) -> Result<Option<Frame>, Error> {
        // Read WebSocket binary message
        // Convert to OSP Frame
    }
    
    pub async fn write_frame(&mut self, frame: Frame) -> Result<(), Error> {
        // Convert OSP Frame to WebSocket binary message
        // Send via WebSocket
    }
}
```

3. **Update owl-server to listen on both**:
```rust
// owl-server/src/lib.rs
pub async fn listen(&self, tcp_addr: &str, ws_addr: Option<&str>) -> Result<(), Error> {
    // Start TCP listener (existing)
    let tcp_listener = TcpListener::bind(tcp_addr).await?;
    
    // Start WebSocket listener (new)
    if let Some(ws_addr) = ws_addr {
        let ws_listener = TcpListener::bind(ws_addr).await?;
        tokio::spawn(async move {
            loop {
                let (stream, _) = ws_listener.accept().await?;
                let ws_conn = WebSocketConnection::accept(stream).await?;
                // Handle connection...
            }
        });
    }
    
    // Existing TCP loop...
}
```

#### Pros
- Native performance
- Direct integration with owl-server
- No extra process overhead

#### Cons
- Significant code changes
- Requires WebSocket protocol knowledge
- Need to handle WebSocket-specific concerns (ping/pong, close frames)

---

### Option 2: WebSocket-to-TCP Bridge (Gateway)

Create a separate process that bridges WebSocket clients to the TCP OSP server.

```
[Browser Client] ←WebSocket→ [Bridge] ←TCP→ [OSP Server]
```

#### Implementation

```rust
// bridge/main.rs
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{accept_async, tungstenite::Message};
use futures_util::{SinkExt, StreamExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let ws_listener = TcpListener::bind("0.0.0.0:8081").await?;
    println!("WebSocket bridge listening on 0.0.0.0:8081");
    
    while let Ok((stream, _)) = ws_listener.accept().await {
        tokio::spawn(handle_connection(stream));
    }
    
    Ok(())
}

async fn handle_connection(stream: TcpStream) {
    // Accept WebSocket connection
    let ws_stream = accept_async(stream).await.expect("Failed to accept");
    let (ws_sender, mut ws_receiver) = ws_stream.split();
    
    // Connect to OSP server
    let osp_stream = TcpStream::connect("127.0.0.1:8080").await.unwrap();
    let (osp_sender, mut osp_receiver) = osp_stream.into_split();
    
    // Bridge: WebSocket → OSP
    tokio::spawn(async move {
        while let Some(msg) = ws_receiver.next().await {
            if let Ok(Message::Binary(data)) = msg {
                let _ = osp_sender.write_all(&data).await;
            }
        }
    });
    
    // Bridge: OSP → WebSocket
    tokio::spawn(async move {
        let mut buf = vec![0u8; 4096];
        loop {
            let n = osp_receiver.read(&mut buf).await.unwrap();
            if n == 0 { break; }
            let _ = ws_sender.send(Message::Binary(buf[..n].to_vec())).await;
        }
    });
}
```

#### Pros
- Minimal changes to owl-server
- Can be deployed independently
- Easy to add TLS termination at the bridge

#### Cons
- Extra process overhead
- Double network hop (though usually negligible)
- Need to manage bridge separately

---

### Option 3: Use Existing Node.js Bridge

The Node.js server already supports WebSocket. Use it as a bridge to the Rust server.

```typescript
// node-bridge.ts
import { WebSocketServer } from 'ws';
import * as net from 'net';

const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', (ws) => {
  const tcp = net.connect(8080, '127.0.0.1');
  
  ws.on('message', (data) => tcp.write(data));
  tcp.on('data', (data) => ws.send(data, { binary: true }));
  
  ws.on('close', () => tcp.end());
  tcp.on('end', () => ws.close());
});
```

#### Pros
- Zero Rust code changes
- Quick to deploy
- Can add features at the bridge layer (compression, auth, rate limiting)

#### Cons
- Requires running Node.js alongside Rust
- Extra operational complexity

---

## Recommended Approach

For production use, I recommend **Option 1 (Native WebSocket Support)** with the following phased implementation:

### Phase 1: Design Document
Create detailed design spec for WebSocket transport layer.

### Phase 2: WebSocket Transport Crate
Implement `owl-transport-websocket` as a separate feature flag.

### Phase 3: Server Integration
Add WebSocket listener to `owl-server` with feature flag.

### Phase 4: Testing
Add integration tests for WebSocket client/server communication.

### Phase 5: Documentation
Update README and examples.

---

## Current Workaround

Until native WebSocket support is added to owl-server, use one of these bridges:

1. **Node.js bridge** (recommended for quick deployment)
2. **Rust bridge** (if you want to stay in Rust ecosystem)
3. **Nginx/HAProxy** with WebSocket-to-TCP proxying

---

## Protocol Compatibility

The OSP protocol is **transport-agnostic**. Whether you use TCP or WebSocket:

- **Header format**: Identical (22 bytes)
- **Payload format**: Identical (JSON)
- **Chunking**: Identical
- **Compression**: Identical

The only difference is the transport layer:
- **TCP**: Raw binary stream
- **WebSocket**: Binary frames over WebSocket protocol

This means a WebSocket client can communicate with a TCP server through a simple bridge without any protocol translation.

---

## Implementation Priority

Given the existing Node.js WebSocket support, the priority for Rust WebSocket support depends on:

1. **Browser client requirement**: If you need browser clients, use Node.js bridge now
2. **Performance requirement**: If you need maximum performance, implement native WebSocket
3. **Deployment simplicity**: If you want single-process deployment, implement native WebSocket

For most use cases, the Node.js bridge is sufficient and can be deployed today.
