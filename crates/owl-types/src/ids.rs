//! Newtype IDs and timestamps.

use serde::{Deserialize, Serialize};
use std::fmt;
use uuid::Uuid;

/// Identifies a device (a client installation).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(transparent)]
pub struct DeviceId(pub Uuid);

impl DeviceId {
    pub fn new() -> Self {
        Self(Uuid::new_v4())
    }
    pub fn from_bytes(b: [u8; 16]) -> Self {
        Self(Uuid::from_bytes(b))
    }
    pub fn as_uuid(&self) -> Uuid {
        self.0
    }
    pub fn as_bytes(&self) -> &[u8; 16] {
        self.0.as_bytes()
    }
}

impl Default for DeviceId {
    fn default() -> Self {
        Self::new()
    }
}

impl fmt::Display for DeviceId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl std::str::FromStr for DeviceId {
    type Err = uuid::Error;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(Self(Uuid::parse_str(s)?))
    }
}

/// Server-issued session identifier.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct SessionId(pub Uuid);

impl SessionId {
    pub fn new() -> Self {
        Self(Uuid::new_v4())
    }
    pub fn as_uuid(&self) -> Uuid {
        self.0
    }
}

impl Default for SessionId {
    fn default() -> Self {
        Self::new()
    }
}

impl fmt::Display for SessionId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

/// Identifies a record within a collection.
#[derive(Debug, Clone, PartialEq, Eq, Hash, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(transparent)]
pub struct RecordId(pub String);

impl RecordId {
    pub fn new(s: impl Into<String>) -> Self {
        Self(s.into())
    }
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for RecordId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl From<&str> for RecordId {
    fn from(s: &str) -> Self {
        Self(s.to_string())
    }
}

impl From<String> for RecordId {
    fn from(s: String) -> Self {
        Self(s)
    }
}

/// Identifies a collection (table-like name).
#[derive(Debug, Clone, PartialEq, Eq, Hash, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(transparent)]
pub struct CollectionId(pub String);

impl CollectionId {
    pub fn new(s: impl Into<String>) -> Self {
        Self(s.into())
    }
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for CollectionId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl From<&str> for CollectionId {
    fn from(s: &str) -> Self {
        Self(s.to_string())
    }
}

impl From<String> for CollectionId {
    fn from(s: String) -> Self {
        Self(s)
    }
}

/// Lamport logical clock. Monotonically increasing per device.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Lamport(pub u64);

impl Lamport {
    pub const ZERO: Self = Self(0);

    pub fn bump(self) -> Self {
        Self(self.0 + 1)
    }

    pub fn advance_to(self, other: Self) -> Self {
        Self(self.0.max(other.0) + 1)
    }

    pub fn as_u64(self) -> u64 {
        self.0
    }
}

impl Default for Lamport {
    fn default() -> Self {
        Self::ZERO
    }
}

impl fmt::Display for Lamport {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl From<u64> for Lamport {
    fn from(v: u64) -> Self {
        Self(v)
    }
}

/// Server-assigned monotonic revision per record.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Revision(pub u64);

impl Revision {
    pub const ZERO: Self = Self(0);
    pub fn bump(self) -> Self {
        Self(self.0 + 1)
    }
    pub fn as_u64(self) -> u64 {
        self.0
    }
}

impl Default for Revision {
    fn default() -> Self {
        Self::ZERO
    }
}

impl fmt::Display for Revision {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

/// UUIDv7 operation identifier. Time-ordered, k-sortable, globally unique.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct OpId(pub Uuid);

impl OpId {
    pub fn new() -> Self {
        Self(Uuid::now_v7())
    }
    pub fn from_uuid(u: Uuid) -> Self {
        Self(u)
    }
    pub fn as_uuid(&self) -> Uuid {
        self.0
    }
}

impl Default for OpId {
    fn default() -> Self {
        Self::new()
    }
}

impl fmt::Display for OpId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl std::str::FromStr for OpId {
    type Err = uuid::Error;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(Self(Uuid::parse_str(s)?))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn device_id_round_trip() {
        let d = DeviceId::new();
        let s = d.to_string();
        let parsed: DeviceId = s.parse().unwrap();
        assert_eq!(d, parsed);
    }

    #[test]
    fn lamport_bump_and_advance() {
        let l = Lamport::ZERO;
        assert_eq!(l.bump(), Lamport(1));
        assert_eq!(Lamport(5).advance_to(Lamport(10)), Lamport(11));
        assert_eq!(Lamport(10).advance_to(Lamport(5)), Lamport(11));
    }

    #[test]
    fn op_id_is_v7() {
        let op = OpId::new();
        // v7 has version bits 0111 in the high nibble of byte 6
        assert_eq!(op.0.get_version_num(), 7);
    }
}
