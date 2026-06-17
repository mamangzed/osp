//! examples/chat: two OwlClient instances exchange messages on a "chat"
//! collection, demonstrating op gen + sync + idempotent apply.
//!
//! Run against a started OSP server. From the workspace root:
//!
//!   cargo run -p owl-server --bin owl-server -- \
//!       --bind 127.0.0.1:9420 --db :memory:
//!   cargo run -p examples-chat
//!
//! The example spins up two clients (alice, bob) on different device IDs
//! and has alice post a few messages; bob sees them via the sync loop.

use owl_client::OwlClientBuilder;
use owl_protocol::Value;
use std::time::Duration;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let alice = OwlClientBuilder::new()
        .url("tcp://127.0.0.1:9420")
        .token("alice-token")
        .local_db("alice.db")
        .build()?;
    let bob = OwlClientBuilder::new()
        .url("tcp://127.0.0.1:9420")
        .token("bob-token")
        .local_db("bob.db")
        .build()?;

    alice.connect().await?;
    bob.connect().await?;

    // Both subscribe to "chat" with a snapshot, so they converge to the
    // same state quickly.
    alice.subscribe("chat", None, true).await?;
    bob.subscribe("chat", None, true).await?;

    // Alice posts a few messages.
    for (i, msg) in ["hello bob", "how are you?", "goodbye"].iter().enumerate() {
        alice
            .set("chat", &format!("msg-{}", i), "text", Value::String(msg.to_string()))
            .await?;
        tokio::time::sleep(Duration::from_millis(100)).await;
    }

    // Wait for sync.
    tokio::time::sleep(Duration::from_millis(500)).await;

    // Bob reads them.
    for i in 0..3 {
        let rec = bob.get("chat", &format!("msg-{}", i)).await?;
        match rec {
            Some(r) => {
                let text = r.fields.get("text").map(value_to_string).unwrap_or_default();
                println!("bob sees msg-{}: {}", i, text);
            }
            None => println!("bob: msg-{} not found", i),
        }
    }

    alice.disconnect();
    bob.disconnect();
    Ok(())
}

fn value_to_string(v: &Value) -> String {
    match v {
        Value::String(s) => s.clone(),
        other => format!("{:?}", other),
    }
}
