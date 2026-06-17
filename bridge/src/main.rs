use tokio::net::{TcpListener, TcpStream};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio_tungstenite::{accept_async, tungstenite::Message};
use futures_util::{SinkExt, StreamExt};
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();

    let ws_addr = env::var("WS_ADDR").unwrap_or_else(|_| "0.0.0.0:8081".to_string());
    let osp_addr = env::var("OSP_ADDR").unwrap_or_else(|_| "127.0.0.1:8080".to_string());

    let listener = TcpListener::bind(&ws_addr).await?;
    println!("🦉 OSP WebSocket Bridge");
    println!("   WebSocket: {}", ws_addr);
    println!("   TCP OSP:   {}", osp_addr);

    while let Ok((stream, addr)) = listener.accept().await {
        println!("New WebSocket connection from: {}", addr);
        let osp_addr = osp_addr.clone();
        tokio::spawn(async move {
            if let Err(e) = handle_connection(stream, &osp_addr).await {
                eprintln!("Connection error: {}", e);
            }
        });
    }

    Ok(())
}

async fn handle_connection(stream: TcpStream, osp_addr: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Accept WebSocket connection
    let ws_stream = accept_async(stream).await?;
    println!("WebSocket handshake complete");

    let (mut ws_sender, mut ws_receiver) = ws_stream.split();

    // Connect to OSP server
    let osp_stream = TcpStream::connect(osp_addr).await?;
    println!("Connected to OSP server at {}", osp_addr);

    let (mut osp_sender, mut osp_receiver) = osp_stream.into_split();

    // Bridge: WebSocket → OSP
    let ws_to_osp = tokio::spawn(async move {
        while let Some(msg) = ws_receiver.next().await {
            match msg {
                Ok(Message::Binary(data)) => {
                    println!("WS → OSP: {} bytes", data.len());
                    if let Err(e) = osp_sender.write_all(&data).await {
                        eprintln!("Failed to write to OSP: {}", e);
                        break;
                    }
                }
                Ok(Message::Close(_)) => {
                    println!("WebSocket closed");
                    break;
                }
                Err(e) => {
                    eprintln!("WebSocket error: {}", e);
                    break;
                }
                _ => {}
            }
        }
    });

    // Bridge: OSP → WebSocket
    let osp_to_ws = tokio::spawn(async move {
        let mut buf = vec![0u8; 65536];
        loop {
            match osp_receiver.read(&mut buf).await {
                Ok(0) => {
                    println!("OSP connection closed");
                    break;
                }
                Ok(n) => {
                    println!("OSP → WS: {} bytes", n);
                    let msg = Message::Binary(buf[..n].to_vec());
                    if let Err(e) = ws_sender.send(msg).await {
                        eprintln!("Failed to send to WebSocket: {}", e);
                        break;
                    }
                }
                Err(e) => {
                    eprintln!("Failed to read from OSP: {}", e);
                    break;
                }
            }
        }
    });

    // Wait for either direction to finish
    tokio::select! {
        _ = ws_to_osp => println!("WebSocket → OSP bridge closed"),
        _ = osp_to_ws => println!("OSP → WebSocket bridge closed"),
    }

    Ok(())
}
