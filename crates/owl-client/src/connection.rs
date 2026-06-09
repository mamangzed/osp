//! Connection management: HELLO, AUTH, reconnect loop.

use crate::config::ClientConfig;
use crate::state::ClientState;
use bytes::Bytes;
use owl_protocol::{AuthMsg, Capability, Envelope, HelloAckMsg, HelloMsg};
use owl_transport::{Connection, Frame, OpCode, PROTOCOL_VERSION};
use std::sync::Arc;
use thiserror::Error;
use tokio::sync::Mutex;
use tracing::{debug, warn};

#[derive(Debug, Error)]
pub enum ConnectError {
    #[error("url parse: {0}")]
    UrlParse(String),
    #[error("transport: {0}")]
    Transport(String),
    #[error("protocol: {0}")]
    Protocol(String),
    #[error("auth failed: {0}")]
    AuthFailed(String),
    #[error("server returned bad HELLO_ACK")]
    BadHello,
}

pub type ConnectResult<T> = std::result::Result<T, ConnectError>;

/// Active connection state.
pub struct ActiveConnection {
    pub conn: Arc<Connection>,
    pub hello_ack: HelloAckMsg,
    pub state: Arc<ClientState>,
    pub next_req_id: Mutex<u64>,
}

impl ActiveConnection {
    pub async fn write_envelope(&self, env: Envelope) -> Result<(), String> {
        let mut id = self.next_req_id.lock().await;
        *id += 1;
        let req_id = *id;
        let bytes = env.encode().map_err(|e| e.to_string())?;
        let frame = Frame::new(env.opcode(), req_id, Bytes::from(bytes));
        self.conn.write_frame(frame).await.map_err(|e| e.to_string())?;
        self.conn.flush().await.map_err(|e| e.to_string())?;
        Ok(())
    }

    pub async fn read_envelope(&self) -> Result<Option<Envelope>, String> {
        let frame = self.conn.read_frame().await.map_err(|e| e.to_string())?;
        let Some(frame) = frame else { return Ok(None); };
        let env = Envelope::decode(frame.header.opcode, &frame.payload).map_err(|e| e.to_string())?;
        Ok(Some(env))
    }
}

pub struct ConnectionManager {
    pub state: Arc<ClientState>,
    pub cfg: ClientConfig,
}

impl ConnectionManager {
    pub fn new(state: Arc<ClientState>, cfg: ClientConfig) -> Self {
        Self { state, cfg }
    }

    /// Open a new TCP connection, run HELLO, run AUTH. Returns the active
    /// connection on success.
    pub async fn connect(&self) -> ConnectResult<Arc<ActiveConnection>> {
        let addr = parse_tcp_addr(&self.cfg.url)?;
        debug!(%addr, "connecting");
        let conn = owl_transport::connect_tcp(&addr).await.map_err(|e| ConnectError::Transport(e.to_string()))?;
        let conn = Arc::new(conn);

        // HELLO
        let hello = HelloMsg {
            protocol_version: PROTOCOL_VERSION as u32,
            sdk_version: format!("owl-client/{}", env!("CARGO_PKG_VERSION")),
            device_id: self.cfg.device_id.unwrap_or_default().to_string(),
            device_platform: std::env::consts::OS.to_string(),
            capabilities: vec![Capability::CompressionZstd, Capability::Chunking, Capability::Resume],
        };
        let req_id = 0;
        let bytes = Envelope::Hello(hello.clone()).encode().map_err(|e| ConnectError::Protocol(e.to_string()))?;
        conn.write_frame(Frame::new(OpCode::Hello, req_id, Bytes::from(bytes))).await.map_err(|e| ConnectError::Transport(e.to_string()))?;
        conn.flush().await.map_err(|e| ConnectError::Transport(e.to_string()))?;

        // HELLO_ACK
        let frame = conn.read_frame().await.map_err(|e| ConnectError::Transport(e.to_string()))?;
        let frame = frame.ok_or(ConnectError::BadHello)?;
        let env = Envelope::decode(frame.header.opcode, &frame.payload).map_err(|e| ConnectError::Protocol(e.to_string()))?;
        let hello_ack = match env {
            Envelope::HelloAck(h) => h,
            other => return Err(ConnectError::Protocol(format!("expected HELLO_ACK, got {:?}", other.opcode()))),
        };

        // AUTH
        let auth = AuthMsg { token: self.cfg.token.clone() };
        let bytes = Envelope::Auth(auth).encode().map_err(|e| ConnectError::Protocol(e.to_string()))?;
        conn.write_frame(Frame::new(OpCode::Auth, 1, Bytes::from(bytes))).await.map_err(|e| ConnectError::Transport(e.to_string()))?;
        conn.flush().await.map_err(|e| ConnectError::Transport(e.to_string()))?;

        // AUTH_OK or AUTH_FAILED
        let frame = conn.read_frame().await.map_err(|e| ConnectError::Transport(e.to_string()))?;
        let frame = frame.ok_or_else(|| ConnectError::AuthFailed("connection closed during auth".into()))?;
        let env = Envelope::decode(frame.header.opcode, &frame.payload).map_err(|e| ConnectError::Protocol(e.to_string()))?;
        match env {
            Envelope::AuthOk(_) => {
                let active = Arc::new(ActiveConnection {
                    conn,
                    hello_ack,
                    state: self.state.clone(),
                    next_req_id: Mutex::new(100),
                });
                Ok(active)
            }
            Envelope::AuthFailed(f) => Err(ConnectError::AuthFailed(format!("{}: {}", f.code, f.message))),
            other => Err(ConnectError::Protocol(format!("expected AUTH_OK/FAILED, got {:?}", other.opcode()))),
        }
    }

    /// Reconnect loop with exponential backoff. Returns the active connection
    /// when successful, or None if max_attempts exhausted.
    pub async fn connect_with_retry(&self) -> ConnectResult<Arc<ActiveConnection>> {
        let strategy = owl_transport::ReconnectStrategy::default();
        let mut attempt = 0u32;
        loop {
            match self.connect().await {
                Ok(c) => return Ok(c),
                Err(e) if self.cfg.reconnect_max_attempts.map_or(true, |m| attempt < m) => {
                    let delay = strategy.delay_for(attempt);
                    warn!(?e, attempt, delay_ms = delay.as_millis() as u64, "reconnect failed; retrying");
                    tokio::time::sleep(delay).await;
                    attempt = attempt.saturating_add(1);
                }
                Err(e) => return Err(e),
            }
        }
    }
}

fn parse_tcp_addr(url: &str) -> ConnectResult<String> {
    // Accepts: tcp://host:port, tls://host:port (TLS in v2), host:port
    if let Some(rest) = url.strip_prefix("tcp://") {
        Ok(rest.to_string())
    } else if let Some(rest) = url.strip_prefix("tls://") {
        // v1: TLS not wired; fall back to plain TCP. Surface a warning.
        warn!("TLS requested but not wired in v1; using plain TCP");
        Ok(rest.to_string())
    } else {
        Ok(url.to_string())
    }
}
