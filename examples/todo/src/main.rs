//! examples/todo: a single OwlClient demonstrates set / get / delete / restore
//! on a "todos" collection.
//!
//!   cargo run -p owl-server --bin owl-server -- \
//!       --bind 127.0.0.1:9420 --db :memory:
//!   cargo run -p examples-todo

use owl_client::OwlClientBuilder;
use owl_protocol::Value;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let client = OwlClientBuilder::new()
        .url("tcp://127.0.0.1:9420")
        .token("demo-token")
        .local_db("todo.db")
        .build()?;
    client.connect().await?;
    client.subscribe("todos", None, true).await?;

    // Create.
    client
        .set("todos", "t1", "title", Value::String("buy milk".into()))
        .await?;
    client
        .set("todos", "t1", "done", Value::Bool(false))
        .await?;

    // Read.
    let r = client.get("todos", "t1").await?;
    println!("t1: {}", format_record(&r));

    // Update.
    client
        .set("todos", "t1", "done", Value::Bool(true))
        .await?;
    let r = client.get("todos", "t1").await?;
    println!("t1 (updated): {}", format_record(&r));

    // Delete.
    client.delete("todos", "t1").await?;
    let r = client.get("todos", "t1").await?;
    println!("t1 (deleted): tombstone={}", r.map(|r| r.tombstone).unwrap_or(true));

    // Restore.
    client.restore("todos", "t1").await?;
    let r = client.get("todos", "t1").await?;
    println!("t1 (restored): tombstone={}", r.map(|r| r.tombstone).unwrap_or(true));

    client.disconnect();
    Ok(())
}

fn format_record(r: &Option<owl_protocol::RecordMsg>) -> String {
    match r {
        Some(r) => format!(
            "record({} fields: {})",
            r.record_id,
            r.fields.iter().map(|(k, v)| format!("{}={:?}", k, v)).collect::<Vec<_>>().join(", ")
        ),
        None => "null".into(),
    }
}
