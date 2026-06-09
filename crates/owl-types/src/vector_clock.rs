//! Vector clock with proper merge semantics.

use crate::ids::DeviceId;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// A vector clock maps each device to its logical clock value.
///
/// Semantics:
/// - `increment(d)`: set the entry for `d` to one greater than its previous value.
/// - `merge(&other)`: per-device max.
/// - `dominates(&other)` / `is_dominated_by(&other)`: compare entry-by-entry.
/// - `concurrent_with(&other)`: neither dominates the other AND they're not equal.
#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct VectorClock {
    entries: BTreeMap<DeviceId, u64>,
}

impl VectorClock {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get(&self, d: &DeviceId) -> u64 {
        self.entries.get(d).copied().unwrap_or(0)
    }

    pub fn set(&mut self, d: DeviceId, value: u64) {
        self.entries.insert(d, value);
    }

    /// Bump this device's entry by 1. Returns the new value.
    pub fn increment(&mut self, d: DeviceId) -> u64 {
        let entry = self.entries.entry(d).or_insert(0);
        *entry += 1;
        *entry
    }

    /// Bump to at least `target`. Returns the new value.
    pub fn increment_to(&mut self, d: DeviceId, target: u64) -> u64 {
        let entry = self.entries.entry(d).or_insert(0);
        if *entry < target {
            *entry = target;
        }
        *entry
    }

    /// Per-device max merge.
    pub fn merge(&mut self, other: &VectorClock) {
        for (d, v) in &other.entries {
            let entry = self.entries.entry(*d).or_insert(0);
            if *v > *entry {
                *entry = *v;
            }
        }
    }

    /// Return a new clock = self merged with other.
    pub fn merged(&self, other: &VectorClock) -> VectorClock {
        let mut c = self.clone();
        c.merge(other);
        c
    }

    /// True iff for every device, self[d] >= other[d], and at least one strict.
    pub fn dominates(&self, other: &VectorClock) -> bool {
        let mut strict = false;
        for (d, v) in &other.entries {
            let s = self.get(d);
            if s < *v {
                return false;
            }
            if s > *v {
                strict = true;
            }
        }
        for (d, _) in &self.entries {
            if !other.entries.contains_key(d) {
                strict = true;
            }
        }
        strict
    }

    pub fn is_dominated_by(&self, other: &VectorClock) -> bool {
        other.dominates(self)
    }

    /// True iff neither dominates the other (i.e. they diverge on at least one device).
    pub fn concurrent_with(&self, other: &VectorClock) -> bool {
        !self.dominates(other) && !other.dominates(self)
    }

    /// True iff clocks are exactly equal.
    pub fn is_equal(&self, other: &VectorClock) -> bool {
        self.entries == other.entries
    }

    /// All device entries.
    pub fn devices(&self) -> impl Iterator<Item = (DeviceId, u64)> + '_ {
        self.entries.iter().map(|(d, v)| (*d, *v))
    }

    pub fn len(&self) -> usize {
        self.entries.len()
    }

    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn dev(n: u8) -> DeviceId {
        let bytes = [n; 16];
        DeviceId::from_bytes(bytes)
    }

    #[test]
    fn empty_clocks_are_equal_and_concurrent() {
        let a = VectorClock::new();
        let b = VectorClock::new();
        // By strict definition, empty clocks are "concurrent" (neither
        // dominates) but are also "equal" (no differences).
        assert!(a.is_equal(&b));
        assert!(a.concurrent_with(&b));
        assert!(!a.dominates(&b));
        assert!(!b.dominates(&a));
    }

    #[test]
    fn increment_bumps_only_target_device() {
        let mut c = VectorClock::new();
        c.increment(dev(1));
        c.increment(dev(2));
        c.increment(dev(2));
        assert_eq!(c.get(&dev(1)), 1);
        assert_eq!(c.get(&dev(2)), 2);
    }

    #[test]
    fn merge_is_componentwise_max() {
        let mut a = VectorClock::new();
        a.set(dev(1), 3);
        a.set(dev(2), 1);
        let mut b = VectorClock::new();
        b.set(dev(1), 1);
        b.set(dev(2), 5);
        b.set(dev(3), 7);
        a.merge(&b);
        assert_eq!(a.get(&dev(1)), 3);
        assert_eq!(a.get(&dev(2)), 5);
        assert_eq!(a.get(&dev(3)), 7);
    }

    #[test]
    fn merge_is_commutative() {
        let mut a = VectorClock::new();
        a.set(dev(1), 3);
        a.set(dev(2), 1);
        let mut b = VectorClock::new();
        b.set(dev(1), 1);
        b.set(dev(2), 5);
        assert_eq!(a.merged(&b), b.merged(&a));
    }

    #[test]
    fn merge_is_associative() {
        let mut a = VectorClock::new();
        a.set(dev(1), 2);
        let mut b = VectorClock::new();
        b.set(dev(2), 3);
        let mut c = VectorClock::new();
        c.set(dev(1), 5);
        c.set(dev(3), 1);
        let r1 = a.merged(&b).merged(&c);
        let r2 = a.merged(&b.merged(&c));
        assert_eq!(r1, r2);
    }

    #[test]
    fn dominates_is_antisymmetric() {
        let mut a = VectorClock::new();
        a.set(dev(1), 2);
        a.set(dev(2), 1);
        let mut b = VectorClock::new();
        b.set(dev(1), 1);
        b.set(dev(2), 1);
        assert!(a.dominates(&b));
        assert!(!b.dominates(&a));
    }

    #[test]
    fn concurrent_detection_is_symmetric() {
        let mut a = VectorClock::new();
        a.set(dev(1), 2);
        let mut b = VectorClock::new();
        b.set(dev(2), 1);
        assert!(a.concurrent_with(&b));
        assert!(b.concurrent_with(&a));
    }

    #[test]
    fn increment_to_advances_monotonically() {
        let mut c = VectorClock::new();
        c.increment_to(dev(1), 5);
        c.increment_to(dev(1), 3);
        c.increment_to(dev(1), 7);
        assert_eq!(c.get(&dev(1)), 7);
    }
}
