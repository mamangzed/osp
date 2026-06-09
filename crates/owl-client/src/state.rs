//! Per-collection local client state.

use dashmap::DashMap;
use owl_sync::SyncEngine;
use owl_types::{CollectionId, Lamport, OpId};
use std::sync::Arc;

/// Shared client state.
pub struct ClientState {
    /// Pending ops per collection, indexed by op_id (sent but not yet acked).
    pub pending_acks: DashMap<OpId, CollectionId>,
    /// Last ack'd lamport per collection.
    pub last_acked_lamport: DashMap<CollectionId, Lamport>,
    /// Active subscriptions (sub_id -> latest known snapshot_revision).
    pub subscriptions: DashMap<String, u64>,
}

impl ClientState {
    pub fn from_engine(_engine: Arc<SyncEngine>) -> Arc<Self> {
        // We don't keep the engine here — the OwlClient owns it directly.
        Arc::new(Self {
            pending_acks: DashMap::new(),
            last_acked_lamport: DashMap::new(),
            subscriptions: DashMap::new(),
        })
    }
}
