//! TCP / TLS connection wrapper that reads and writes OSP frames.
//!
//! The transport supports two stream kinds:
//! - `Plain` — a raw `TcpStream` (used for the v1 default)
//! - `Tls`   — a `TlsStream<TcpStream>` from `tokio-rustls` (used when TLS is
//!             negotiated by the server or client)
//!
//! Both are unified behind a `TransportStream` enum that implements
//! `AsyncRead` + `AsyncWrite` so the same `Connection` logic works for both.

use crate::compress;
use crate::frame::{FLAG_CHUNK, FLAG_CHUNK_LAST, FLAG_COMPRESSED, Frame, FrameError, FrameHeader, HEADER_LEN};
use bytes::{BufMut, Bytes, BytesMut};
use std::io;
use std::pin::Pin;
use std::task::{Context, Poll};
use tokio::io::{AsyncRead, AsyncReadExt, AsyncWrite, AsyncWriteExt, BufReader, ReadHalf, WriteHalf};
use tokio::net::TcpStream;
use tokio::sync::Mutex;
use tokio_rustls::server::TlsStream;

/// Underlying stream type carried by a `Connection`.
pub enum TransportStream {
    Plain(TcpStream),
    TlsServer(TlsStream<TcpStream>),
    TlsClient(tokio_rustls::client::TlsStream<TcpStream>),
    /// Duplex stream — used for WebSocket bridging and testing.
    Duplex(tokio::io::DuplexStream),
}

impl AsyncRead for TransportStream {
    fn poll_read(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut tokio::io::ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        match &mut *self {
            Self::Plain(s) => Pin::new(s).poll_read(cx, buf),
            Self::TlsServer(s) => Pin::new(s).poll_read(cx, buf),
            Self::TlsClient(s) => Pin::new(s).poll_read(cx, buf),
            Self::Duplex(s) => Pin::new(s).poll_read(cx, buf),
        }
    }
}

impl AsyncWrite for TransportStream {
    fn poll_write(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        match &mut *self {
            Self::Plain(s) => Pin::new(s).poll_write(cx, buf),
            Self::TlsServer(s) => Pin::new(s).poll_write(cx, buf),
            Self::TlsClient(s) => Pin::new(s).poll_write(cx, buf),
            Self::Duplex(s) => Pin::new(s).poll_write(cx, buf),
        }
    }

    fn poll_flush(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        match &mut *self {
            Self::Plain(s) => Pin::new(s).poll_flush(cx),
            Self::TlsServer(s) => Pin::new(s).poll_flush(cx),
            Self::TlsClient(s) => Pin::new(s).poll_flush(cx),
            Self::Duplex(s) => Pin::new(s).poll_flush(cx),
        }
    }

    fn poll_shutdown(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        match &mut *self {
            Self::Plain(s) => Pin::new(s).poll_shutdown(cx),
            Self::TlsServer(s) => Pin::new(s).poll_shutdown(cx),
            Self::TlsClient(s) => Pin::new(s).poll_shutdown(cx),
            Self::Duplex(s) => Pin::new(s).poll_shutdown(cx),
        }
    }
}

type ReadEnd = BufReader<ReadHalf<TransportStream>>;
type WriteEnd = WriteHalf<TransportStream>;

pub struct Connection {
    reader: Mutex<ReadEnd>,
    writer: Mutex<WriteEnd>,
    chunk_buf: Mutex<Option<ChunkState>>,
    next_chunk_id: Mutex<u32>,
}

struct ChunkState {
    id: u32,
    accumulated: BytesMut,
    opcode: crate::opcode::OpCode,
    req_id: u64,
    flags: u16,
}

impl Connection {
    /// Wrap a raw TCP stream.
    pub fn new(stream: TcpStream) -> Self {
        Self::from_transport(TransportStream::Plain(stream))
    }

    /// Wrap a server-side TLS stream.
    pub fn new_tls(stream: TlsStream<TcpStream>) -> Self {
        Self::from_transport(TransportStream::TlsServer(stream))
    }

    /// Wrap a client-side TLS stream.
    pub fn new_tls_for_client(stream: tokio_rustls::client::TlsStream<TcpStream>) -> Self {
        Self::from_transport(TransportStream::TlsClient(stream))
    }

    /// Wrap a duplex stream (used for WebSocket bridging).
    pub fn new_duplex(stream: tokio::io::DuplexStream) -> Self {
        Self::from_transport(TransportStream::Duplex(stream))
    }

    fn from_transport(stream: TransportStream) -> Self {
        let (r, w) = tokio::io::split(stream);
        Self {
            reader: Mutex::new(BufReader::new(r)),
            writer: Mutex::new(w),
            chunk_buf: Mutex::new(None),
            next_chunk_id: Mutex::new(0),
        }
    }

    pub async fn read_frame(&self) -> Result<Option<Frame>, FrameError> {
        let header = self.read_header().await?;
        let Some(header) = header else { return Ok(None) };

        let mut payload = BytesMut::zeroed(header.length as usize);
        if header.length > 0 {
            self.reader
                .lock()
                .await
                .read_exact(&mut payload)
                .await
                .map_err(|e| {
                    if e.kind() == std::io::ErrorKind::UnexpectedEof {
                        FrameError::ConnectionClosed
                    } else {
                        FrameError::Io(e)
                    }
                })?;
        }

        if header.flags & FLAG_CHUNK != 0 {
            if payload.len() < 4 {
                return Err(FrameError::Incomplete);
            }
            let chunk_id = u32::from_be_bytes(payload[..4].try_into().unwrap());
            let body = payload.split_off(4).freeze();

            let is_last = header.flags & FLAG_CHUNK_LAST != 0;
            let mut buf = self.chunk_buf.lock().await;
            match &mut *buf {
                None => {
                    if is_last {
                        *buf = None;
                        return Ok(Some(self.finalize_frame(header, body)?));
                    }
                    *buf = Some(ChunkState {
                        id: chunk_id,
                        accumulated: BytesMut::from(&body[..]),
                        opcode: header.opcode,
                        req_id: header.req_id,
                        flags: header.flags,
                    });
                    drop(buf);
                    return Box::pin(self.read_frame()).await;
                }
                Some(state) if state.id == chunk_id => {
                    state.accumulated.extend_from_slice(&body);
                    if is_last {
                        let assembled = ChunkState {
                            id: state.id,
                            accumulated: std::mem::take(&mut state.accumulated),
                            opcode: state.opcode,
                            req_id: state.req_id,
                            flags: state.flags,
                        };
                        *buf = None;
                        let body = assembled.accumulated.freeze();
                        let f = self.finalize_frame(
                            FrameHeader {
                                opcode: assembled.opcode,
                                version: crate::frame::PROTOCOL_VERSION,
                                flags: assembled.flags,
                                length: body.len() as u32,
                                req_id: assembled.req_id,
                            },
                            body,
                        )?;
                        return Ok(Some(f));
                    }
                    drop(buf);
                    return Box::pin(self.read_frame()).await;
                }
                Some(state) => {
                    tracing::warn!(expected = state.id, got = chunk_id, "chunk id mismatch, resetting");
                    *buf = None;
                    return Box::pin(self.read_frame()).await;
                }
            }
        }

        Ok(Some(self.finalize_frame(header, payload.freeze())?))
    }

    fn finalize_frame(&self, header: FrameHeader, payload: Bytes) -> Result<Frame, FrameError> {
        let payload = if header.flags & FLAG_COMPRESSED != 0 {
            compress::decompress(&payload)?
        } else {
            payload
        };
        Ok(Frame {
            header: FrameHeader {
                length: payload.len() as u32,
                ..header
            },
            payload,
        })
    }

    async fn read_header(&self) -> Result<Option<FrameHeader>, FrameError> {
        let mut header_buf = BytesMut::zeroed(HEADER_LEN);
        let n = self.reader.lock().await.read(&mut header_buf).await?;
        if n == 0 {
            return Ok(None);
        }
        if n < HEADER_LEN {
            let mut filled = BytesMut::from(&header_buf[..n]);
            while filled.len() < HEADER_LEN {
                let mut extra = [0u8; HEADER_LEN];
                let m = self.reader.lock().await.read(&mut extra).await?;
                if m == 0 {
                    return Err(FrameError::Incomplete);
                }
                filled.extend_from_slice(&extra[..m]);
            }
            header_buf = filled;
        }
        Ok(Some(FrameHeader::decode(header_buf.freeze())?))
    }

    pub async fn write_frame(&self, frame: Frame) -> Result<(), FrameError> {
        let Frame { header, payload } = frame;
        let mut payload = if header.flags & FLAG_COMPRESSED != 0 {
            let c = compress::compress(&payload)?;
            Bytes::from(c)
        } else {
            payload
        };

        if payload.len() as u32 <= crate::frame::MAX_PAYLOAD_LEN {
            let mut out = BytesMut::new();
            FrameHeader {
                length: payload.len() as u32,
                ..header
            }
            .encode(&mut out);
            out.extend_from_slice(&payload);
            self.writer.lock().await.write_all(&out).await?;
            return Ok(());
        }

        let chunk_id = {
            let mut g = self.next_chunk_id.lock().await;
            let id = *g;
            *g = g.wrapping_add(1);
            id
        };
        let max = crate::frame::MAX_PAYLOAD_LEN as usize;
        let mut first = true;
        while !payload.is_empty() {
            let take = payload.len().min(max);
            let body = payload.split_to(take);
            let mut chunk_payload = BytesMut::with_capacity(4 + body.len());
            chunk_payload.put_u32(chunk_id);
            chunk_payload.extend_from_slice(&body);
            let mut flags = header.flags & !FLAG_CHUNK_LAST;
            if first {
                flags |= FLAG_CHUNK;
            }
            if payload.is_empty() {
                flags |= FLAG_CHUNK_LAST;
            }
            let mut out = BytesMut::new();
            FrameHeader {
                opcode: header.opcode,
                version: header.version,
                flags,
                length: chunk_payload.len() as u32,
                req_id: header.req_id,
            }
            .encode(&mut out);
            out.extend_from_slice(&chunk_payload);
            self.writer.lock().await.write_all(&out).await?;
            first = false;
        }
        Ok(())
    }

    pub async fn flush(&self) -> Result<(), FrameError> {
        self.writer.lock().await.flush().await?;
        Ok(())
    }
}

pub async fn connect_tcp(addr: &str) -> Result<Connection, FrameError> {
    let stream = TcpStream::connect(addr).await?;
    stream.set_nodelay(true).ok();
    Ok(Connection::new(stream))
}

/// TLS configuration and connection helpers.
pub mod tls {
    use rustls::ClientConfig;
    use std::sync::Arc;
    use tokio::net::TcpStream;

    use super::{Connection, FrameError, TlsStream};

    #[derive(Clone)]
    pub enum TlsConfig {
        Client(Arc<ClientConfig>),
        Server(Arc<rustls::ServerConfig>),
    }

    /// Build a default client config with a custom root store.
    pub fn client_with_roots(roots: rustls::RootCertStore) -> Arc<ClientConfig> {
        Arc::new(ClientConfig::builder()
            .with_root_certificates(roots)
            .with_no_client_auth())
    }

    /// Server-side TLS accept: take an already-accepted TCP stream and perform
    /// the rustls handshake. Returns a `Connection` over the resulting TLS
    /// stream. The `server_name` in the cert is the one the client expects.
    pub async fn accept_tls(
        stream: TcpStream,
        server_config: Arc<rustls::ServerConfig>,
    ) -> Result<Connection, FrameError> {
        let acceptor = tokio_rustls::TlsAcceptor::from(server_config);
        let tls = acceptor.accept(stream).await.map_err(|e| {
            FrameError::Io(std::io::Error::other(format!("tls accept: {}", e)))
        })?;
        Ok(Connection::new_tls(tls))
    }

    /// Client-side TLS connect: dial TCP, then perform the rustls handshake
    /// using `server_name` for SNI + cert verification.
    pub async fn connect_tls(
        addr: &str,
        client_config: Arc<ClientConfig>,
        server_name: &str,
    ) -> Result<Connection, FrameError> {
        let stream = TcpStream::connect(addr).await?;
        stream.set_nodelay(true).ok();
        let connector = tokio_rustls::TlsConnector::from(client_config);
        let dns_name = rustls::pki_types::ServerName::try_from(server_name.to_owned())
            .map_err(|e| FrameError::Io(std::io::Error::other(format!("dns name: {}", e))))?;
        let tls: tokio_rustls::client::TlsStream<TcpStream> = connector
            .connect(dns_name, stream)
            .await
            .map_err(|e| FrameError::Io(std::io::Error::other(format!("tls connect: {}", e))))?;
        // Wrap the client TlsStream in a TransportStream::Tls variant.
        // Both client and server TlsStream implement AsyncRead+AsyncWrite,
        // so the same Connection logic works.
        Ok(Connection::new_tls_for_client(tls))
    }
}
