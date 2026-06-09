//! Heartbeat: detect dead connections via missed heartbeats.

use std::sync::Arc;
use std::sync::atomic::{AtomicU64, AtomicU8, Ordering};
use std::time::Duration;
use tokio::sync::Notify;
use tokio::time::Instant;

/// Heartbeat state shared between writer and reader tasks.
pub struct Heartbeat {
    pub interval: Duration,
    pub max_missed: u8,
    last_recv_ms: AtomicU64,
    missed: AtomicU8,
    /// Notified when a frame is received (to wake the watcher).
    pub on_recv: Notify,
}

impl Heartbeat {
    pub fn new(interval: Duration, max_missed: u8) -> Arc<Self> {
        Arc::new(Self {
            interval,
            max_missed,
            last_recv_ms: AtomicU64::new(now_ms()),
            missed: AtomicU8::new(0),
            on_recv: Notify::new(),
        })
    }

    pub fn record_recv(&self) {
        self.last_recv_ms.store(now_ms(), Ordering::Relaxed);
        self.missed.store(0, Ordering::Relaxed);
        self.on_recv.notify_one();
    }

    pub fn record_miss(&self) -> u8 {
        let prev = self.missed.fetch_add(1, Ordering::Relaxed);
        prev + 1
    }

    pub fn missed(&self) -> u8 {
        self.missed.load(Ordering::Relaxed)
    }

    pub fn last_recv(&self) -> u64 {
        self.last_recv_ms.load(Ordering::Relaxed)
    }

    /// Returns true if the connection should be considered dead.
    pub fn is_dead(&self) -> bool {
        self.missed() >= self.max_missed
    }
}

/// Check whether we should emit a heartbeat now.
pub fn should_send_heartbeat(hb: &Heartbeat, _now: Instant) -> bool {
    let last_ms = hb.last_recv();
    let interval_ms = hb.interval.as_millis() as u64;
    let elapsed = now_ms().saturating_sub(last_ms);
    elapsed >= interval_ms
}

fn now_ms() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn record_recv_resets_missed() {
        let hb = Heartbeat::new(Duration::from_secs(15), 3);
        assert_eq!(hb.missed(), 0);
        hb.record_miss();
        hb.record_miss();
        assert_eq!(hb.missed(), 2);
        assert!(!hb.is_dead());
        hb.record_recv();
        assert_eq!(hb.missed(), 0);
    }

    #[test]
    fn dead_after_max_missed() {
        let hb = Heartbeat::new(Duration::from_secs(15), 3);
        for _ in 0..3 {
            hb.record_miss();
        }
        assert!(hb.is_dead());
    }
}
