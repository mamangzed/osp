//! Periodic snapshot of collections (see design §6.7).
//!
//! Every N operations per collection, persist a fresh `Snapshot` to
//! `SnapshotStore`. New subscribers can then take the latest snapshot
//! and pull only ops since `lamport_floor`, never the full history.

use crate::session::Router;
use owl_protocol::SnapshotMsg;
use owl_storage::{ListFilter, OpLogStore, RecordStore, SnapshotStore};
use owl_types::{CollectionId, Lamport};
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;
use tokio::time::interval;
use tracing::{debug, error, info, warn};

/// Spawn the snapshot task. Returns the JoinHandle so tests can abort.
pub fn spawn(
    router: Arc<Router>,
    records: Arc<dyn RecordStore>,
    oplog: Arc<dyn OpLogStore>,
    snapshots: Arc<dyn SnapshotStore>,
    every: u64,
    period: Duration,
) -> tokio::task::JoinHandle<()> {
    tokio::spawn(async move {
        run(router, records, oplog, snapshots, every, period).await;
    })
}

async fn run(
    router: Arc<Router>,
    records: Arc<dyn RecordStore>,
    oplog: Arc<dyn OpLogStore>,
    snapshots: Arc<dyn SnapshotStore>,
    every: u64,
    period: Duration,
) {
    let mut tick = interval(period);
    let mut last_snapshotted: HashMap<CollectionId, u64> = HashMap::new();
    loop {
        tick.tick().await;
        let collections: Vec<CollectionId> = router.collection_list();
        for coll in collections {
            let latest = match oplog.latest_lamport(&coll).await {
                Ok(Some(l)) => l.0,
                Ok(None) => continue, // no ops yet
                Err(e) => {
                    warn!(collection = %coll, error = %e, "latest_lamport failed");
                    continue;
                }
            };
            let prev = last_snapshotted.get(&coll).copied().unwrap_or(0);
            if latest.saturating_sub(prev) < every {
                continue;
            }
            match snapshot_collection(&coll, &records, &oplog).await {
                Ok(Some(snap)) => {
                    if let Err(e) = snapshots.save_snapshot(&coll, &snap).await {
                        error!(collection = %coll, error = %e, "save_snapshot failed");
                        continue;
                    }
                    last_snapshotted.insert(coll.clone(), latest);
                    info!(
                        collection = %coll,
                        revision = snap.revision,
                        lamport_floor = snap.lamport_floor,
                        records = snap.records.len(),
                        "snapshot saved"
                    );
                }
                Ok(None) => debug!(collection = %coll, "no records to snapshot"),
                Err(e) => warn!(collection = %coll, error = %e, "snapshot_collection failed"),
            }
        }
    }
}

async fn snapshot_collection(
    coll: &CollectionId,
    records: &Arc<dyn RecordStore>,
    oplog: &Arc<dyn OpLogStore>,
) -> anyhow::Result<Option<SnapshotMsg>> {
    let recs = records.list_collection(coll, &ListFilter::default()).await?;
    if recs.is_empty() {
        return Ok(None);
    }
    let lamport_floor = oplog.latest_lamport(coll).await?.unwrap_or(Lamport::ZERO).0;
    let revision = recs.iter().map(|r| r.revision).max().unwrap_or(0);
    Ok(Some(SnapshotMsg {
        collection: coll.to_string(),
        revision,
        lamport_floor,
        records: recs,
    }))
}
