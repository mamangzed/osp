//! examples/multi-device: two OwlClient devices (laptop + phone) on the same
//! "user" with shared data. Device A writes a record; device B reads it after
//! taking a snapshot+delta. Demonstrates subscription snapshot flow.
//!
//!   cargo run -p owl-server --bin owl-server -- \
//!       --bind 127.0.0.1:9420 --db :memory:
//!   cargo run -p examples-multi-device

use owl_client::OwlClientBuilder;
use owl_protocol::Value;
use owl_types::DeviceId;
use std::time::Duration;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    // Two devices. We give them stable UUIDs so re-runs converge.
    let laptop_id = DeviceId(uuid::Uuid::parse_str("11111111-1111-1111-1111-111111111111")?);
    let phone_id = DeviceId(uuid::Uuid::parse_str("22222222-2222-2222-2222-222222222222")?);

    let laptop = OwlClientBuilder::new()
        .url("tcp://127.0.0.1:9420")
        .token("user-laptop")
        .device_id(laptop_id)
        .local_db("laptop.db")
        .build()?;
    let phone = OwlClientBuilder::new()
        .url("tcp://127.0.0.1:9420")
        .token("user-phone")
        .device_id(phone_id)
        .local_db("phone.db")
        .build()?;

    laptop.connect().await?;
    phone.connect().await?;

    // Both subscribe with snapshot.
    laptop.subscribe("notes", None, true).await?;
    phone.subscribe("notes", None, true).await?;

    // Laptop writes a note.
    laptop
        .set("notes", "n1", "body", Value::String("hello from laptop".into()))
        .await?;

    // Phone pulls a delta explicitly (in v1.1 this would be a SyncPush from
    // server fan-out; for the example we use sync_since to demonstrate the
    // pull path).
    phone.sync_since("notes", owl_types::Lamport::ZERO).await?;
    tokio::time::sleep(Duration::from_millis(300)).await;

    // Phone reads.
    let rec = phone.get("notes", "n1").await?;
    match rec {
        Some(r) => println!("phone sees n1: {:?}", r.fields.get("body")),
        None => println!("phone: n1 not found"),
    }

    // Phone writes back.
    phone
        .set("notes", "n1", "acked_by", Value::String("phone".into()))
        .await?;
    laptop.sync_since("notes", owl_types::Lamport::ZERO).await?;
    tokio::time::sleep(Duration::from_millis(300)).await;

    let rec = laptop.get("notes", "n1").await?;
    println!("laptop sees n1: {:?}", rec.map(|r| r.fields));

    laptop.disconnect();
    phone.disconnect();
    Ok(())
}
