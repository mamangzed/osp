//! Exponential backoff with jitter for reconnect.

use rand::Rng;
use std::time::Duration;

#[cfg(test)]
mod tests_disabled {}

/// Reconnect strategy: exponential backoff with full jitter.
///
/// Sequence: 1s, 2s, 4s, 8s, 15s, 30s, 30s, ... (capped).
pub struct ReconnectStrategy {
    pub base: Duration,
    pub cap: Duration,
    pub max_attempts: Option<u32>,
}

impl Default for ReconnectStrategy {
    fn default() -> Self {
        Self {
            base: Duration::from_secs(1),
            cap: Duration::from_secs(30),
            max_attempts: None,
        }
    }
}

impl ReconnectStrategy {
    pub fn delay_for(&self, attempt: u32) -> Duration {
        let exp = 1u64 << attempt.min(20);
        let raw = self.base.as_millis() as u64 * exp;
        let capped = raw.min(self.cap.as_millis() as u64);
        let jittered = {
            let mut rng = rand::thread_rng();
            rng.gen_range(0..=capped)
        };
        Duration::from_millis(jittered)
    }

    pub fn should_retry(&self, attempt: u32) -> bool {
        match self.max_attempts {
            Some(max) => attempt < max,
            None => true,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn delay_caps_at_cap() {
        let s = ReconnectStrategy {
            base: Duration::from_secs(1),
            cap: Duration::from_secs(30),
            max_attempts: None,
        };
        let d = s.delay_for(20);
        assert!(d <= s.cap);
    }

    #[test]
    fn should_retry_infinite_by_default() {
        let s = ReconnectStrategy::default();
        assert!(s.should_retry(0));
        assert!(s.should_retry(1_000_000));
    }

    #[test]
    fn should_retry_respects_max() {
        let s = ReconnectStrategy {
            base: Duration::from_secs(1),
            cap: Duration::from_secs(30),
            max_attempts: Some(3),
        };
        assert!(s.should_retry(0));
        assert!(s.should_retry(2));
        assert!(!s.should_retry(3));
        assert!(!s.should_retry(4));
    }
}
