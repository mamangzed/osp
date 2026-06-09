//! Optional zstd compression / decompression of frame payloads.

use crate::frame::FrameError;
use bytes::Bytes;

/// Compress payload with zstd. Returns the compressed bytes.
///
/// Default level is 3 — fast enough for interactive workloads, good ratio.
pub fn compress(payload: &[u8]) -> Result<Bytes, FrameError> {
    zstd::encode_all(payload, 3)
        .map(Bytes::from)
        .map_err(|e| FrameError::Zstd(e.to_string()))
}

/// Decompress a zstd payload.
pub fn decompress(payload: &[u8]) -> Result<Bytes, FrameError> {
    zstd::decode_all(payload)
        .map(Bytes::from)
        .map_err(|e| FrameError::Zstd(e.to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn compress_decompress_round_trip() {
        let original = b"hello world hello world hello world hello world hello world";
        let compressed = compress(original).unwrap();
        let decompressed = decompress(&compressed).unwrap();
        assert_eq!(&decompressed[..], original);
    }

    #[test]
    fn small_payload_round_trip() {
        let original = b"hi";
        let compressed = compress(original).unwrap();
        let decompressed = decompress(&compressed).unwrap();
        assert_eq!(&decompressed[..], original);
    }
}
