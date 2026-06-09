//! Server configuration.

use clap::Parser;

#[derive(Debug, Clone, Parser)]
#[command(name = "owl-server", version, about = "OSP sync server")]
pub struct Config {
    /// TCP bind address (host:port)
    #[arg(long, default_value = "0.0.0.0:9420", env = "OWL_BIND")]
    pub bind: String,

    /// JWT shared secret (HS256). Required if you want JWT auth.
    #[arg(long, env = "OWL_JWT_SECRET")]
    pub jwt_secret: Option<String>,

    /// SQLite database path. Use `:memory:` for in-memory.
    #[arg(long, default_value = "owl.db", env = "OWL_DB")]
    pub db: String,

    /// Heartbeat interval in milliseconds
    #[arg(long, default_value_t = 15000)]
    pub heartbeat_ms: u64,

    /// Snapshot cadence: save a snapshot every N operations per collection
    #[arg(long, default_value_t = 1000)]
    pub snapshot_every: u64,

    /// Maximum concurrent connections
    #[arg(long, default_value_t = 1024)]
    pub max_connections: usize,
}
