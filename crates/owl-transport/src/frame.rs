//! OSP frame header & codec.

use crate::opcode::OpCode;
use bytes::{Buf, BufMut, Bytes, BytesMut};

/// Magic bytes identifying OSP v1 frames: "OWL1".
pub const MAGIC: [u8; 4] = *b"OWL1";

/// Current wire protocol version.
pub const PROTOCOL_VERSION: u16 = 1;

/// Maximum single-frame payload size (16 MiB).
pub const MAX_PAYLOAD_LEN: u32 = 16 * 1024 * 1024;

/// Header size in bytes.
pub const HEADER_LEN: usize = 22;

/// Flag bit: payload is zstd-compressed.
pub const FLAG_COMPRESSED: u16 = 1 << 0;
/// Flag bit: this frame is the first or middle chunk of a fragmented message.
pub const FLAG_CHUNK: u16 = 1 << 1;
/// Flag bit: this frame is the last chunk of a fragmented message.
pub const FLAG_CHUNK_LAST: u16 = 1 << 2;

/// 22-byte fixed frame header.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct FrameHeader {
    /// OSP opcode.
    pub opcode: OpCode,
    /// Wire version (must equal PROTOCOL_VERSION for this build).
    pub version: u16,
    /// Flag bits (see FLAG_*).
    pub flags: u16,
    /// Payload length in bytes.
    pub length: u32,
    /// Request ID, monotonic per direction. Used only for ACK matching.
    pub req_id: u64,
}

impl FrameHeader {
    /// Encode header to 22 bytes, big-endian.
    pub fn encode(&self, out: &mut BytesMut) {
        out.reserve(HEADER_LEN);
        out.put_slice(&MAGIC);
        out.put_u16(self.version);
        out.put_u16(self.opcode.as_u16());
        out.put_u16(self.flags);
        out.put_u32(self.length);
        out.put_u64(self.req_id);
    }

    /// Decode header from the first 22 bytes of `buf`. Returns the header and
    /// consumes 22 bytes. Returns Err on magic/version mismatch.
    pub fn decode(mut buf: Bytes) -> Result<Self, FrameError> {
        if buf.len() < HEADER_LEN {
            return Err(FrameError::Incomplete);
        }
        let magic: [u8; 4] = buf[..4].try_into().unwrap();
        if magic != MAGIC {
            return Err(FrameError::BadMagic(magic));
        }
        buf.advance(4);
        let version = buf.get_u16();
        let opcode_raw = buf.get_u16();
        let flags = buf.get_u16();
        let length = buf.get_u32();
        let req_id = buf.get_u64();

        if version != PROTOCOL_VERSION {
            return Err(FrameError::BadVersion(version));
        }
        let opcode = OpCode::from_u16(opcode_raw).ok_or(FrameError::BadOpcode(opcode_raw))?;
        if length > MAX_PAYLOAD_LEN {
            return Err(FrameError::PayloadTooLarge(length));
        }
        Ok(Self {
            opcode,
            version,
            flags,
            length,
            req_id,
        })
    }
}

/// A complete frame: header + payload.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Frame {
    pub header: FrameHeader,
    pub payload: Bytes,
}

impl Frame {
    pub fn new(opcode: OpCode, req_id: u64, payload: Bytes) -> Self {
        Self {
            header: FrameHeader {
                opcode,
                version: PROTOCOL_VERSION,
                flags: 0,
                length: payload.len() as u32,
                req_id,
            },
            payload,
        }
    }

    pub fn with_flags(mut self, flags: u16) -> Self {
        self.header.flags = flags;
        self
    }

    pub fn is_compressed(&self) -> bool {
        self.header.flags & FLAG_COMPRESSED != 0
    }

    pub fn is_chunk(&self) -> bool {
        self.header.flags & FLAG_CHUNK != 0
    }

    pub fn is_chunk_last(&self) -> bool {
        self.header.flags & FLAG_CHUNK_LAST != 0
    }
}

/// Frame-level errors.
#[derive(Debug, thiserror::Error)]
pub enum FrameError {
    #[error("incomplete frame: need more bytes")]
    Incomplete,
    #[error("bad magic: {0:?}")]
    BadMagic([u8; 4]),
    #[error("bad protocol version: {0}")]
    BadVersion(u16),
    #[error("bad opcode: 0x{0:04x}")]
    BadOpcode(u16),
    #[error("payload too large: {0} bytes")]
    PayloadTooLarge(u32),
    #[error("io: {0}")]
    Io(#[from] std::io::Error),
    #[error("zstd: {0}")]
    Zstd(String),
    #[error("connection closed")]
    ConnectionClosed,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn header_round_trip() {
        let h = FrameHeader {
            opcode: OpCode::Patch,
            version: PROTOCOL_VERSION,
            flags: FLAG_COMPRESSED,
            length: 1234,
            req_id: 0xDEADBEEFCAFEBABE,
        };
        let mut buf = BytesMut::new();
        h.encode(&mut buf);
        assert_eq!(buf.len(), HEADER_LEN);
        assert_eq!(&buf[..4], &MAGIC);
        let parsed = FrameHeader::decode(buf.freeze()).unwrap();
        assert_eq!(parsed, h);
    }

    #[test]
    fn bad_magic_rejected() {
        let mut buf = BytesMut::new();
        buf.put_slice(&[0xFF, 0xFF, 0xFF, 0xFF]);
        buf.put_u16(PROTOCOL_VERSION);
        buf.put_u16(OpCode::Hello.as_u16());
        buf.put_u16(0);
        buf.put_u32(0);
        buf.put_u64(0);
        match FrameHeader::decode(buf.freeze()) {
            Err(FrameError::BadMagic(_)) => {}
            other => panic!("expected BadMagic, got {:?}", other),
        }
    }

    #[test]
    fn bad_version_rejected() {
        let mut buf = BytesMut::new();
        buf.put_slice(&MAGIC);
        buf.put_u16(99);
        buf.put_u16(OpCode::Hello.as_u16());
        buf.put_u16(0);
        buf.put_u32(0);
        buf.put_u64(0);
        match FrameHeader::decode(buf.freeze()) {
            Err(FrameError::BadVersion(99)) => {}
            other => panic!("expected BadVersion, got {:?}", other),
        }
    }

    #[test]
    fn oversized_payload_rejected() {
        let mut buf = BytesMut::new();
        buf.put_slice(&MAGIC);
        buf.put_u16(PROTOCOL_VERSION);
        buf.put_u16(OpCode::Hello.as_u16());
        buf.put_u16(0);
        buf.put_u32(MAX_PAYLOAD_LEN + 1);
        buf.put_u64(0);
        match FrameHeader::decode(buf.freeze()) {
            Err(FrameError::PayloadTooLarge(_)) => {}
            other => panic!("expected PayloadTooLarge, got {:?}", other),
        }
    }

    #[test]
    fn frame_flag_helpers() {
        let f = Frame::new(OpCode::Patch, 1, Bytes::from_static(b"x")).with_flags(FLAG_COMPRESSED);
        assert!(f.is_compressed());
        assert!(!f.is_chunk());
        assert!(!f.is_chunk_last());
    }
}
