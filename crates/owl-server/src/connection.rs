//! Per-connection handler: HELLO → AUTH → READY → SUBSCRIBE → SYNC loop.

use crate::session::{Router, Session};
use bytes::Bytes;
use owl_auth::{AuthError, TokenValidator};
use owl_protocol::{AuthOkMsg, Capability, Envelope, HelloAckMsg, SubscribeMsg, UnsubscribeMsg};
use owl_storage::{OpLogStore, RecordStore, SnapshotStore};
use owl_transport::{Connection, Frame, MAGIC, MAX_PAYLOAD_LEN, OpCode, PROTOCOL_VERSION};
use std::sync::Arc;
use tokio::net::TcpListener;
use tokio::sync::mpsc;
use tracing::{debug, info, warn};

pub struct ConnectionHandler {
    pub conn: Connection,
    pub session: Arc<Session>,
    pub server_id: String,
    pub heartbeat_interval_ms: u32,
    pub snapshot_window: u64,
    pub capabilities: Vec<Capability>,
    pub router: Arc<Router>,
    pub records: Arc<dyn RecordStore>,
    pub oplog: Arc<dyn OpLogStore>,
    pub snapshots: Arc<dyn SnapshotStore>,
    pub validator: Arc<dyn TokenValidator>,
    /// Receiver half of the session's outbound channel. The run loop
    /// drains this concurrently with reading from the wire.
    pub rx: mpsc::UnboundedReceiver<Envelope>,
    pub on_op: Option<Arc<dyn Fn(owl_protocol::OperationMsg) + Send + Sync>>,
}

/// Context passed to the dispatch loop, everything except the live
/// `Connection` so the select! can borrow `conn` and the rest independently.
pub struct Ctx<'a> {
    pub session: &'a Arc<Session>,
    pub server_id: &'a str,
    pub router: &'a Router,
    pub records: &'a dyn RecordStore,
    pub oplog: &'a dyn OpLogStore,
    pub snapshots: &'a dyn SnapshotStore,
    pub validator: &'a dyn TokenValidator,
    pub on_op: Option<&'a Arc<dyn Fn(owl_protocol::OperationMsg) + Send + Sync>>,
}

impl ConnectionHandler {
    pub async fn run(mut self) -> anyhow::Result<()> {
        // 1) HELLO
        let hello = read_envelope(&mut self.conn, OpCode::Hello).await?;
        let hello = match hello {
            Envelope::Hello(h) => h,
            _ => return Err(anyhow::anyhow!("expected HELLO")),
        };
        debug!(device = %hello.device_id, "received HELLO");

        let hello_ack = HelloAckMsg {
            protocol_version: hello.protocol_version,
            server_version: env!("CARGO_PKG_VERSION").to_string(),
            session_id: self.session.id.to_string(),
            heartbeat_interval_ms: self.heartbeat_interval_ms,
            selected_capabilities: hello.capabilities.clone(),
            snapshot_window: self.snapshot_window,
        };
        write_envelope(&self.conn, Envelope::HelloAck(hello_ack)).await?;

        // 2) AUTH
        let auth = read_envelope(&mut self.conn, OpCode::Auth).await?;
        let token = match auth {
            Envelope::Auth(a) => a.token,
            _ => return Err(anyhow::anyhow!("expected AUTH")),
        };
        let claims = match self.validator.validate(&token) {
            Ok(c) => c,
            Err(e) => {
                let env = Envelope::AuthFailed(owl_protocol::AuthFailedMsg {
                    code: match e {
                        AuthError::Expired => 401,
                        _ => 403,
                    },
                    message: e.to_string(),
                    detail: String::new(),
                });
                write_envelope(&self.conn, env).await?;
                return Ok(());
            }
        };
        write_envelope(
            &self.conn,
            Envelope::AuthOk(AuthOkMsg {
                device_id: claims.device_id.to_string(),
                collection_scopes: claims.collection_scopes.clone(),
            }),
        )
        .await?;
        debug!(device = %claims.device_id, "AUTH ok");

        // 3) Loop: drain tx channel + read incoming frames concurrently.
        let ConnectionHandler {
            conn,
            session,
            server_id,
            router,
            records,
            oplog,
            snapshots,
            validator,
            rx,
            on_op,
            ..
        } = self;
        let session_id = session.id;
        run_loop(
            conn,
            session,
            server_id,
            router,
            records,
            oplog,
            snapshots,
            validator,
            rx,
            on_op,
            session_id,
        )
        .await
    }
}

async fn run_loop(
    mut conn: Connection,
    session: Arc<Session>,
    server_id: String,
    router: Arc<Router>,
    records: Arc<dyn RecordStore>,
    oplog: Arc<dyn OpLogStore>,
    snapshots: Arc<dyn SnapshotStore>,
    validator: Arc<dyn TokenValidator>,
    mut rx: mpsc::UnboundedReceiver<Envelope>,
    on_op: Option<Arc<dyn Fn(owl_protocol::OperationMsg) + Send + Sync>>,
    session_id: uuid::Uuid,
) -> anyhow::Result<()> {
    loop {
        let read_fut = conn.read_frame();
        tokio::select! {
            biased;
            // Outbound: server-initiated envelopes (fan-out, presence, etc.)
            env = rx.recv() => {
                let Some(env) = env else {
                    debug!(session = %session_id, "tx channel closed");
                    return Ok(());
                };
                if let Err(e) = write_envelope(&conn, env).await {
                    warn!(session = %session_id, error = %e, "write error");
                    return Ok(());
                }
            }
            // Inbound: client-initiated frames.
            frame = read_fut => {
                let env = match frame {
                    Ok(Some(f)) => match Envelope::decode(f.header.opcode, &f.payload) {
                        Ok(e) => Some(e),
                        Err(err) => {
                            warn!(session = %session_id, error = %err, "decode error");
                            None
                        }
                    },
                    Ok(None) => {
                        debug!(session = %session_id, "client closed");
                        return Ok(());
                    }
                    Err(e) => {
                        warn!(session = %session_id, error = %e, "read error");
                        return Ok(());
                    }
                };
                if let Some(env) = env {
                    let ctx = Ctx {
                        session: &session,
                        server_id: &server_id,
                        router: router.as_ref(),
                        records: records.as_ref(),
                        oplog: oplog.as_ref(),
                        snapshots: snapshots.as_ref(),
                        validator: validator.as_ref(),
                        on_op: on_op.as_ref(),
                    };
                    if let Err(e) = dispatch_inbound(&mut conn, &ctx, env).await {
                        warn!(session = %session_id, error = %e, "inbound handler error");
                    }
                }
            }
        }
    }
}

async fn dispatch_inbound(conn: &mut Connection, ctx: &Ctx<'_>, env: Envelope) -> anyhow::Result<()> {
    match env {
        Envelope::Subscribe(s) => handle_subscribe(conn, ctx, s).await?,
        Envelope::Unsubscribe(u) => handle_unsubscribe(ctx, u).await?,
        Envelope::Op(op) => handle_op(conn, ctx, op).await?,
        Envelope::Ping(_) => {
            write_envelope(
                conn,
                Envelope::Pong(owl_protocol::HelloMsg {
                    protocol_version: PROTOCOL_VERSION as u32,
                    sdk_version: "server".into(),
                    device_id: ctx.server_id.to_string(),
                    device_platform: "server".into(),
                    capabilities: vec![],
                }),
            )
            .await?;
        }
        Envelope::Presence(_) => {
            // v1: PRESENCE is a heartbeat-style frame. We log and ACK
            // implicitly by receiving. Full presence broadcast is v1.1.
            debug!(session = %ctx.session.id, "presence");
        }
        Envelope::AuthOk(_) | Envelope::AuthFailed(_) | Envelope::Hello(_) | Envelope::HelloAck(_) => {
            warn!("unexpected envelope after auth");
        }
        _ => {
            debug!("unhandled envelope");
        }
    }
    Ok(())
}

async fn handle_subscribe(conn: &mut Connection, ctx: &Ctx<'_>, s: SubscribeMsg) -> anyhow::Result<()> {
    if !ctx.validator.has_scope(&ctx.session.claims, &s.collection) {
        write_envelope(
            conn,
            Envelope::SubscribeAck(owl_protocol::SubscribeAckMsg {
                subscription_id: s.subscription_id.clone(),
                accepted: false,
                error: Some(owl_protocol::ErrorMsg {
                    code: 403,
                    message: "missing scope".into(),
                    detail: s.collection.clone(),
                }),
                snapshot_revision: 0,
            }),
        )
        .await?;
        return Ok(());
    }

    // Save latest snapshot, then snapshot revision to client.
    let rev = if s.with_snapshot {
        let records = ctx
            .records
            .list_collection(
                &owl_types::CollectionId::new(s.collection.clone()),
                &owl_storage::ListFilter::default(),
            )
            .await?;
        let lamport_floor = ctx
            .oplog
            .latest_lamport(&owl_types::CollectionId::new(s.collection.clone()))
            .await?
            .unwrap_or(owl_types::Lamport::ZERO)
            .0;
        let revision = records.iter().map(|r| r.revision).max().unwrap_or(0);
        let snap = owl_protocol::SnapshotMsg {
            collection: s.collection.clone(),
            revision,
            lamport_floor,
            records,
        };
        ctx.snapshots
            .save_snapshot(&owl_types::CollectionId::new(s.collection.clone()), &snap)
            .await?;
        // Send snapshot
        write_envelope(conn, Envelope::Snapshot(snap.clone())).await?;
        revision
    } else {
        0
    };

    ctx.router.subscribe(
        s.subscription_id.clone(),
        owl_types::CollectionId::new(s.collection.clone()),
        ctx.session.clone(),
    );
    ctx.session.add_subscription(s.subscription_id.clone());
    write_envelope(
        conn,
        Envelope::SubscribeAck(owl_protocol::SubscribeAckMsg {
            subscription_id: s.subscription_id,
            accepted: true,
            error: None,
            snapshot_revision: rev,
        }),
    )
    .await?;
    Ok(())
}

async fn handle_unsubscribe(ctx: &Ctx<'_>, u: UnsubscribeMsg) -> anyhow::Result<()> {
    ctx.router.unsubscribe(&u.subscription_id, ctx.session.id);
    ctx.session.remove_subscription(&u.subscription_id);
    Ok(())
}

async fn handle_op(conn: &mut Connection, ctx: &Ctx<'_>, op: owl_protocol::OperationMsg) -> anyhow::Result<()> {
    // ACL check
    if !ctx.validator.has_scope(&ctx.session.claims, &op.collection) {
        write_envelope(
            conn,
            Envelope::OpAck(owl_protocol::OpAckMsg {
                op_id: op.op_id.clone(),
                accepted: false,
                error: Some(owl_protocol::ErrorMsg {
                    code: 403,
                    message: "missing scope".into(),
                    detail: op.collection.clone(),
                }),
                revision: 0,
            }),
        )
        .await?;
        return Ok(());
    }
    // Idempotency
    let op_uuid = owl_types::OpId(uuid::Uuid::parse_str(&op.op_id)?);
    if ctx.oplog.has_op(&op_uuid).await? {
        write_envelope(
            conn,
            Envelope::OpAck(owl_protocol::OpAckMsg {
                op_id: op.op_id.clone(),
                accepted: true,
                error: None,
                revision: 0,
            }),
        )
        .await?;
        return Ok(());
    }
    // Persist
    ctx.oplog.append_op(&op).await?;
    let coll = owl_types::CollectionId::new(op.collection.clone());
    let rid = owl_types::RecordId::new(op.record_id.clone());
    // Apply op
    let current = ctx.records.get_record(&coll, &rid).await?;
    let (new, _outcome) = owl_sync::apply_op(current.as_ref(), &op)?;
    if let Some(rec) = new {
        ctx.records.put_record(&coll, &rec).await?;
    }
    // Fan-out: push the op to all sessions subscribed to this collection,
    // excluding the sender. Each session's run loop drains its tx channel
    // and writes to the wire.
    let targets = ctx.router.fan_out(&op);
    for s in targets {
        if s.id == ctx.session.id { continue; }
        s.observe_lamport(&coll, op.lamport);
        // If the channel is closed (session ended), the send is a no-op.
        let _ = s.tx.send(Envelope::Op(op.clone()));
    }
    // ACK
    write_envelope(
        conn,
        Envelope::OpAck(owl_protocol::OpAckMsg {
            op_id: op.op_id.clone(),
            accepted: true,
            error: None,
            revision: 0,
        }),
    )
    .await?;
    if let Some(cb) = ctx.on_op { cb(op); }
    Ok(())
}

async fn read_envelope(conn: &mut Connection, expected: OpCode) -> anyhow::Result<Envelope> {
    let frame = conn.read_frame().await?;
    let Some(frame) = frame else {
        return Err(anyhow::anyhow!("connection closed before {:?}", expected));
    };
    if frame.header.opcode != expected {
        return Err(anyhow::anyhow!(
            "expected {:?}, got {:?}",
            expected,
            frame.header.opcode
        ));
    }
    let env = Envelope::decode(frame.header.opcode, &frame.payload)?;
    Ok(env)
}

async fn write_envelope(conn: &Connection, env: Envelope) -> anyhow::Result<()> {
    let req_id = 0; // server-to-client uses its own counter; for v1 we use 0.
    let bytes = env.encode()?;
    if bytes.len() as u32 > MAX_PAYLOAD_LEN {
        return Err(anyhow::anyhow!("envelope too large to send"));
    }
    let frame = Frame::new(env.opcode(), req_id, Bytes::from(bytes));
    conn.write_frame(frame).await?;
    conn.flush().await?;
    Ok(())
}

/// TCP accept loop.
pub async fn accept_loop(
    listener: TcpListener,
    router: Arc<Router>,
    records: Arc<dyn RecordStore>,
    oplog: Arc<dyn OpLogStore>,
    snapshots: Arc<dyn SnapshotStore>,
    validator: Arc<dyn TokenValidator>,
    cfg: &crate::config::Config,
) -> anyhow::Result<()> {
    loop {
        let (stream, addr) = listener.accept().await?;
        stream.set_nodelay(true).ok();
        let conn = Connection::new(stream);
        let device_id = owl_types::DeviceId::new();
        let (session, rx) = Session::new(
            uuid::Uuid::new_v4(),
            device_id,
            owl_auth::Claims {
                device_id,
                exp: i64::MAX,
                iat: 0,
                collection_scopes: vec!["*".into()],
                user_id: None,
            },
        );
        let handler = ConnectionHandler {
            conn,
            session,
            server_id: format!("owl-server-{}", &uuid::Uuid::new_v4().to_string()[..8]),
            heartbeat_interval_ms: cfg.heartbeat_ms as u32,
            snapshot_window: cfg.snapshot_every,
            capabilities: vec![],
            router: router.clone(),
            records: records.clone(),
            oplog: oplog.clone(),
            snapshots: snapshots.clone(),
            validator: validator.clone(),
            rx,
            on_op: None,
        };
        info!(%addr, "new connection");
        tokio::spawn(async move {
            if let Err(e) = handler.run().await {
                warn!("connection error: {}", e);
            }
        });
    }
}

// Suppress unused warnings for fields kept for future use.
#[allow(dead_code)]
const _MAGIC: [u8; 4] = MAGIC;
