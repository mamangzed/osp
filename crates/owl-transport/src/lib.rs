//! owl-transport: OSP frame codec, TCP, TLS, heartbeat, reconnect, chunking, zstd.
//!
//! This crate has NO dependencies on other OSP crates. The transport is a
//! separate concern from the protocol — the wire format is bytes; the protocol
//! decodes those bytes into typed messages (in `owl-protocol`).

#![forbid(unsafe_code)]


pub mod compress;
pub mod connection;
pub mod frame;
pub mod heartbeat;
pub mod opcode;
pub mod reconnect;

#[cfg(feature = "websocket")]
pub mod websocket;

pub use connection::Connection;
pub use frame::{Frame, FrameError, FrameHeader, FLAG_CHUNK, FLAG_CHUNK_LAST, FLAG_COMPRESSED, HEADER_LEN, MAGIC, MAX_PAYLOAD_LEN, PROTOCOL_VERSION};
pub use opcode::OpCode;

pub use heartbeat::Heartbeat;
pub use reconnect::ReconnectStrategy;

pub use connection::connect_tcp;
pub use connection::tls::{accept_tls, client_with_roots, connect_tls, TlsConfig};

#[cfg(feature = "websocket")]
pub use websocket::accept_websocket;

/// Re-export the `tls` submodule so callers can refer to it as
/// `owl_transport::tls::connect_tls` etc.
pub mod tls {
    pub use crate::connection::tls::{accept_tls, client_with_roots, connect_tls, TlsConfig};
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn constants_exported() {
        assert_eq!(MAGIC, *b"OWL1");
        assert_eq!(PROTOCOL_VERSION, 1);
        assert_eq!(HEADER_LEN, 22);
    }

    #[tokio::test]
    async fn tls_round_trip() {
        use crate::frame::{Frame, FrameHeader, PROTOCOL_VERSION};
        use bytes::Bytes;
        use rcgen::generate_simple_self_signed;
        use std::sync::Arc;
        use tokio::net::TcpListener;

        // 1. Generate a self-signed cert + key in-memory.
        let cert = generate_simple_self_signed(vec!["localhost".into()]).unwrap();
        let cert_der = cert.cert.der().to_vec();
        let key_der = cert.key_pair.serialize_der();

        // 2. Build a rustls ServerConfig that uses the cert.
        let server_certs = vec![rustls::pki_types::CertificateDer::from(cert_der.clone())];
        let server_key = rustls::pki_types::PrivateKeyDer::try_from(key_der).unwrap();
        let server_config = Arc::new(
            rustls::ServerConfig::builder()
                .with_no_client_auth()
                .with_single_cert(server_certs, server_key)
                .unwrap(),
        );

        // 3. Build a ClientConfig that trusts the same cert.
        let mut roots = rustls::RootCertStore::empty();
        roots.add(rustls::pki_types::CertificateDer::from(cert_der)).unwrap();
        let client_config = client_with_roots(roots);

        // 4. Bind a TCP listener. Server task accepts with TLS, client dials
        //    plain TCP, then wraps with TLS. They exchange one frame.
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let server_cfg = server_config.clone();
        let server = tokio::spawn(async move {
            let (stream, _) = listener.accept().await.unwrap();
            let mut conn = accept_tls(stream, server_cfg).await.unwrap();
            let frame = conn.read_frame().await.unwrap().unwrap();
            // Echo the frame back.
            conn.write_frame(frame).await.unwrap();
            conn.flush().await.unwrap();
        });

        let client = connect_tls(&addr.to_string(), client_config, "localhost").await.unwrap();
        let mut client = client;
        let payload = Bytes::from_static(b"hello-over-tls");
        let f = Frame {
            header: FrameHeader {
                opcode: OpCode::Ping,
                version: PROTOCOL_VERSION,
                flags: 0,
                length: payload.len() as u32,
                req_id: 1,
            },
            payload,
        };
        client.write_frame(f.clone()).await.unwrap();
        client.flush().await.unwrap();
        let got = client.read_frame().await.unwrap().unwrap();
        assert_eq!(got.payload, f.payload);
        server.await.unwrap();
    }
}
