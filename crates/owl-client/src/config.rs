//! Client configuration.

use owl_types::DeviceId;
use std::time::Duration;

#[derive(Debug, Clone)]
pub struct ClientConfig {
    /// Server URL, e.g. "tcp://127.0.0.1:9420" or "tls://server.example.com:9420"
    pub url: String,
    /// Auth token (JWT or API key)
    pub token: String,
    /// This device's id (auto-generated if None)
    pub device_id: Option<DeviceId>,
    /// Local SQLite database path for offline cache
    pub local_db: Option<String>,
    /// Heartbeat interval (default 15s)
    pub heartbeat_interval: Duration,
    /// Reconnect strategy
    pub reconnect_max_attempts: Option<u32>,
}

impl Default for ClientConfig {
    fn default() -> Self {
        Self {
            url: "tcp://127.0.0.1:9420".to_string(),
            token: String::new(),
            device_id: None,
            local_db: None,
            heartbeat_interval: Duration::from_secs(15),
            reconnect_max_attempts: None,
        }
    }
}
