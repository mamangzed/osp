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

    /// Open a new connection (plain TCP or TLS, depending on URL scheme),
    /// run HELLO + AUTH. Returns the active connection on success.
    pub async fn connect(&self) -> ConnectResult<Arc<ActiveConnection>> {
        let parsed = parse_url(&self.cfg.url)?;
        debug!(addr = %parsed.addr, scheme = %parsed.scheme, "connecting");
        let conn = match parsed.scheme {
            UrlScheme::Tcp => {
                owl_transport::connect_tcp(&parsed.addr)
                    .await
                    .map_err(|e| ConnectError::Transport(e.to_string()))?
            }
            UrlScheme::Tls => {
                let server_name = self
                    .cfg
                    .tls
                    .server_name
                    .clone()
                    .unwrap_or_else(|| parsed.host.clone());
                let tls_cfg = crate::config::build_tls_client_config(&self.cfg.tls)
                    .map_err(|e| ConnectError::Transport(format!("tls config: {}", e)))?;
                owl_transport::tls::connect_tls(&parsed.addr, tls_cfg, &server_name)
                    .await
                    .map_err(|e| ConnectError::Transport(e.to_string()))?
            }
        };
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

/// URL scheme → transport selector.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum UrlScheme {
    Tcp,
    Tls,
}

impl std::fmt::Display for UrlScheme {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            UrlScheme::Tcp => f.write_str("tcp"),
            UrlScheme::Tls => f.write_str("tls"),
        }
    }
}

#[derive(Debug, Clone)]
struct ParsedUrl {
    /// `host:port` (no scheme).
    addr: String,
    /// Just the host portion, used as the SNI default.
    host: String,
    scheme: UrlScheme,
}

/// Parse `tcp://host:port`, `tls://host:port`, or bare `host:port` into a
/// transport selector + address. Bare addresses default to TCP.
fn parse_url(url: &str) -> ConnectResult<ParsedUrl> {
    let (scheme, rest) = if let Some(r) = url.strip_prefix("tls://") {
        (UrlScheme::Tls, r)
    } else if let Some(r) = url.strip_prefix("tcp://") {
        (UrlScheme::Tcp, r)
    } else {
        (UrlScheme::Tcp, url)
    };
    // Strip any trailing path/query.
    let addr = rest.split(['/', '?']).next().unwrap_or(rest).to_string();
    let host = addr
        .rsplit_once(':')
        .map(|(h, _)| h.to_string())
        .unwrap_or_else(|| addr.clone());
    Ok(ParsedUrl { addr, host, scheme })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_tcp_explicit() {
        let p = parse_url("tcp://127.0.0.1:9420").unwrap();
        assert_eq!(p.scheme, UrlScheme::Tcp);
        assert_eq!(p.addr, "127.0.0.1:9420");
        assert_eq!(p.host, "127.0.0.1");
    }

    #[test]
    fn parse_tls_selects_tls() {
        let p = parse_url("tls://server.example.com:9420").unwrap();
        assert_eq!(p.scheme, UrlScheme::Tls);
        assert_eq!(p.addr, "server.example.com:9420");
        assert_eq!(p.host, "server.example.com");
    }

    #[test]
    fn parse_bare_defaults_to_tcp() {
        let p = parse_url("server.example.com:9420").unwrap();
        assert_eq!(p.scheme, UrlScheme::Tcp);
        assert_eq!(p.addr, "server.example.com:9420");
    }

    #[test]
    fn parse_strips_trailing_path() {
        let p = parse_url("tls://server:9420/some/path?x=1").unwrap();
        assert_eq!(p.scheme, UrlScheme::Tls);
        assert_eq!(p.addr, "server:9420");
    }
}
