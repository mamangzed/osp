use clap::Parser;
use owl_server::config::Config;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cfg = Config::parse();
    owl_server::server::run(cfg).await
}