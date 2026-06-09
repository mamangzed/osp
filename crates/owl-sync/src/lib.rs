//! owl-sync: op generation, merge, replay, snapshot sync for OSP.

#![forbid(unsafe_code)]


pub mod engine;
pub mod merge;
pub mod op;

pub use engine::{SyncEngine, SyncError, SyncResult};
pub use merge::{apply_op, MergeOutcome};
pub use op::{build_delete, build_restore, build_update, make_field_change};
