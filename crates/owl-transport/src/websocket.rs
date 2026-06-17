//! WebSocket connection wrapper for OSP transport.
//!
//! Bridges a `tokio_tungstenite::WebSocketStream` to a `DuplexStream` so it can
//! be used with the existing `Connection` logic without modifying the core codec.

#[cfg(feature = "websocket")]
mod ws_impl {
    use crate::connection::Connection;
    use crate::frame::FrameError;
    use futures_util::{SinkExt, StreamExt};
    use std::io;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};

    /// Accept a WebSocket connection and return an OSP `Connection` that bridges
    /// WebSocket messages to the OSP frame codec via a duplex stream.
    pub async fn accept_websocket(stream: tokio::net::TcpStream) -> Result<Connection, FrameError> {
        let ws = tokio_tungstenite::accept_async(stream)
            .await
            .map_err(|e| FrameError::Io(io::Error::new(io::ErrorKind::Other, e.to_string())))?;

        // Create a duplex stream pair (64KB buffer each direction)
        let (client_stream, server_stream) = tokio::io::duplex(64 * 1024);

        // Spawn bridge task: WebSocket <-> Duplex
        tokio::spawn(async move {
            bridge_ws_to_duplex(ws, client_stream).await;
        });

        // Return a Connection wrapping the server end of the duplex
        Ok(Connection::new_duplex(server_stream))
    }

    /// Bridge between WebSocket stream and duplex stream.
    async fn bridge_ws_to_duplex(
        ws: tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>,
        duplex: tokio::io::DuplexStream,
    ) {
        let (mut ws_sink, mut ws_stream) = ws.split();
        let (mut duplex_reader, mut duplex_writer) = tokio::io::split(duplex);

        // WebSocket -> Duplex (read from WS, write to duplex)
        let ws_to_duplex = tokio::spawn(async move {
            loop {
                tokio::select! {
                    // Read from WebSocket
                    ws_msg = ws_stream.next() => {
                        match ws_msg {
                            Some(Ok(msg)) => {
                                if msg.is_binary() {
                                    if let Err(e) = duplex_writer.write_all(&msg.into_data()).await {
                                        tracing::debug!("Duplex write error: {}", e);
                                        break;
                                    }
                                } else if msg.is_close() {
                                    break;
                                }
                            }
                            Some(Err(e)) => {
                                tracing::debug!("WebSocket read error: {}", e);
                                break;
                            }
                            None => break,
                        }
                    }
                }
            }
        });

        // Duplex -> WebSocket (read from duplex, write to WS)
        let duplex_to_ws = tokio::spawn(async move {
            let mut buf = vec![0u8; 65536];
            loop {
                match duplex_reader.read(&mut buf).await {
                    Ok(0) => break, // EOF
                    Ok(n) => {
                        let msg = tokio_tungstenite::tungstenite::Message::Binary(buf[..n].to_vec());
                        if let Err(e) = ws_sink.send(msg).await {
                            tracing::debug!("WebSocket send error: {}", e);
                            break;
                        }
                    }
                    Err(e) => {
                        tracing::debug!("Duplex read error: {}", e);
                        break;
                    }
                }
            }
        });

        // Wait for either direction to finish
        let _ = tokio::join!(ws_to_duplex, duplex_to_ws);
    }
}

#[cfg(feature = "websocket")]
pub use ws_impl::*;
