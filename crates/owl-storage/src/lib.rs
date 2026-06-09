//! owl-storage: record / op-log / snapshot stores.

#![forbid(unsafe_code)]


pub mod memory;
pub mod sqlite;
pub mod traits;

pub use traits::*;

pub use memory::MemoryBackend;
pub use sqlite::SqliteBackend;
