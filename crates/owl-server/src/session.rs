//! Per-connection session state on the server side.

use dashmap::{DashMap, DashSet};
use owl_auth::Claims;
use owl_protocol::OperationMsg;
use owl_types::{CollectionId, DeviceId, Lamport, RecordId};
use std::sync::Arc;
use tokio::sync::mpsc;

/// State for a single connected client.
#[derive(Debug)]
pub struct Session {
    pub id: uuid::Uuid,
    pub device_id: DeviceId,
    pub claims: Claims,
    /// Per-collection highest lamport the client has acknowledged.
    pub last_seen_lamport: DashMap<CollectionId, Lamport>,
    /// Active subscription IDs.
    pub subscriptions: parking_lot::Mutex<Vec<String>>,
    /// Outbound envelope channel. The connection's read loop also drains this
    /// and writes to the wire, enabling server fan-out across sessions.
    pub tx: mpsc::UnboundedSender<owl_protocol::Envelope>,
}

impl Session {
    pub fn new(id: uuid::Uuid, device_id: DeviceId, claims: Claims) -> (Arc<Self>, mpsc::UnboundedReceiver<owl_protocol::Envelope>) {
        let (tx, rx) = mpsc::unbounded_channel();
        let s = Arc::new(Self {
            id,
            device_id,
            claims,
            last_seen_lamport: DashMap::new(),
            subscriptions: parking_lot::Mutex::new(Vec::new()),
            tx,
        });
        (s, rx)
    }

    pub fn observe_lamport(&self, coll: &CollectionId, lamport: u64) {
        self.last_seen_lamport
            .entry(coll.clone())
            .and_modify(|l| *l = Lamport(l.0.max(lamport)))
            .or_insert(Lamport(lamport));
    }

    pub fn add_subscription(&self, sub_id: String) {
        self.subscriptions.lock().push(sub_id);
    }

    pub fn remove_subscription(&self, sub_id: &str) -> bool {
        let mut g = self.subscriptions.lock();
        let before = g.len();
        g.retain(|s| s != sub_id);
        before != g.len()
    }
}

/// Router: routes operations to interested sessions.
#[derive(Default)]
pub struct Router {
    /// subscription_id -> set of sessions
    subs: DashMap<String, Vec<Arc<Session>>>,
    /// collection_id -> set of sessions
    coll_subs: DashMap<CollectionId, Vec<Arc<Session>>>,
    /// All collections the server knows about (set on first subscribe).
    /// Snapshot task uses this to enumerate.
    collections: DashSet<CollectionId>,
}

impl Router {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn subscribe(&self, sub_id: String, collection: CollectionId, session: Arc<Session>) {
        self.subs.entry(sub_id).or_default().push(session.clone());
        self.coll_subs.entry(collection.clone()).or_default().push(session);
        self.collections.insert(collection);
    }

    pub fn unsubscribe(&self, sub_id: &str, session_id: uuid::Uuid) {
        if let Some(mut v) = self.subs.get_mut(sub_id) {
            v.retain(|s| s.id != session_id);
        }
        // Note: we don't remove the collection from `collections` even if the
        // last subscriber leaves. The snapshot task will skip empty collections
        // because list_collection returns [] for them.
    }

    /// Snapshot of all collections that have ever been subscribed to.
    pub fn collection_list(&self) -> Vec<CollectionId> {
        self.collections.iter().map(|c| c.key().clone()).collect()
    }

    pub fn fan_out(&self, op: &OperationMsg) -> Vec<Arc<Session>> {
        // v1 routing: scope to subscribers of the matching collection. Server-side
        // query filtering is still in scope for a later phase; for v1 we
        // accept oversharing within a collection and let clients filter.
        let coll = CollectionId::new(op.collection.clone());
        let mut out: Vec<Arc<Session>> = Vec::new();
        if let Some(v) = self.coll_subs.get(&coll) {
            for s in v.value().iter() {
                out.push(s.clone());
            }
        }
        out
    }

    pub fn subscriber_count(&self) -> usize {
        let mut n = 0;
        for kv in self.subs.iter() {
            n += kv.value().len();
        }
        n
    }
}

/// Tracks the last assigned revision per record.
#[derive(Default)]
pub struct RevisionCounter {
    per_record: DashMap<(CollectionId, RecordId), u64>,
}

impl RevisionCounter {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn next(&self, coll: &CollectionId, id: &RecordId) -> u64 {
        let mut entry = self
            .per_record
            .entry((coll.clone(), id.clone()))
            .or_insert(0);
        *entry += 1;
        *entry
    }
}
