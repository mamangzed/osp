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

pub use connection::Connection;
pub use frame::{Frame, FrameError, FrameHeader, FLAG_CHUNK, FLAG_CHUNK_LAST, FLAG_COMPRESSED, HEADER_LEN, MAGIC, MAX_PAYLOAD_LEN, PROTOCOL_VERSION};
pub use opcode::OpCode;

pub use heartbeat::Heartbeat;
pub use reconnect::ReconnectStrategy;

pub use connection::connect_tcp;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn constants_exported() {
        assert_eq!(MAGIC, *b"OWL1");
        assert_eq!(PROTOCOL_VERSION, 1);
        assert_eq!(HEADER_LEN, 22);
    }
}
