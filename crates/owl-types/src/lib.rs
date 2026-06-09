//! owl-types: Newtype IDs, vector clock, lamport timestamp.
//!
//! This crate has no dependencies on other OSP crates. It is the foundation.

#![forbid(unsafe_code)]


pub mod ids;
pub mod vector_clock;

pub use ids::{CollectionId, DeviceId, Lamport, OpId, RecordId, Revision, SessionId};
pub use vector_clock::VectorClock;

/// Library-wide error type.
#[derive(Debug, thiserror::Error)]
pub enum OspError {
    /// UUID parse failure.
    #[error("invalid uuid: {0}")]
    InvalidUuid(#[from] uuid::Error),
}

pub type Result<T> = std::result::Result<T, OspError>;
