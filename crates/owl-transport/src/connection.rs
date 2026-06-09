//! TCP / TLS connection wrapper that reads and writes OSP frames.

use crate::compress;
use crate::frame::{FLAG_CHUNK, FLAG_CHUNK_LAST, FLAG_COMPRESSED, Frame, FrameError, FrameHeader, HEADER_LEN};
use bytes::{BufMut, Bytes, BytesMut};
use tokio::io::{AsyncReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpStream;
use tokio::sync::Mutex;

type ReadHalf = BufReader<tokio::io::ReadHalf<TcpStream>>;
type WriteHalf = tokio::io::WriteHalf<TcpStream>;

pub struct Connection {
    reader: Mutex<ReadHalf>,
    writer: Mutex<WriteHalf>,
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
    pub fn new(stream: TcpStream) -> Self {
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

/// TLS configuration (placeholder for v1; full TLS wrapping ships in Stage 7).
pub mod tls {
    use rustls::ClientConfig;
    use std::sync::Arc;

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
}
