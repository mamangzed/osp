//! Per-connection handler: HELLO → AUTH → READY → SUBSCRIBE → SYNC loop.

use crate::session::{Router, Session};
use bytes::Bytes;
use owl_auth::{AuthError, TokenValidator};
use owl_protocol::{AuthOkMsg, Capability, Envelope, HelloAckMsg, SubscribeMsg, UnsubscribeMsg};
use owl_storage::{OpLogStore, RecordStore, SnapshotStore};
use owl_transport::{Connection, Frame, MAGIC, MAX_PAYLOAD_LEN, OpCode, PROTOCOL_VERSION};
use std::sync::Arc;
use tokio::net::TcpListener;
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
    pub on_op: Option<Arc<dyn Fn(owl_protocol::OperationMsg) + Send + Sync>>,
}

impl ConnectionHandler {
    pub async fn run(mut self) -> anyhow::Result<()> {
        // 1) HELLO
        let hello = self.read_envelope(OpCode::Hello).await?;
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
        self.write_envelope(Envelope::HelloAck(hello_ack)).await?;

        // 2) AUTH
        let auth = self.read_envelope(OpCode::Auth).await?;
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
                self.write_envelope(env).await?;
                return Ok(());
            }
        };
        self.write_envelope(Envelope::AuthOk(AuthOkMsg {
            device_id: claims.device_id.to_string(),
            collection_scopes: claims.collection_scopes.clone(),
        }))
        .await?;
        debug!(device = %claims.device_id, "AUTH ok");

        // 3) Loop: SUBSCRIBE / UNSUBSCRIBE / OP / PING
        loop {
            let env = match self.read_any_envelope().await {
                Ok(Some(e)) => e,
                Ok(None) => {
                    debug!(session = %self.session.id, "client closed");
                    return Ok(());
                }
                Err(e) => {
                    warn!(session = %self.session.id, error = %e, "read error");
                    return Ok(());
                }
            };
            match env {
                Envelope::Subscribe(s) => self.handle_subscribe(s).await?,
                Envelope::Unsubscribe(u) => self.handle_unsubscribe(u).await?,
                Envelope::Op(op) => self.handle_op(op).await?,
                Envelope::Ping(_) => {
                    self.write_envelope(Envelope::Pong(owl_protocol::HelloMsg {
                        protocol_version: PROTOCOL_VERSION as u32,
                        sdk_version: "server".into(),
                        device_id: self.server_id.clone(),
                        device_platform: "server".into(),
                        capabilities: vec![],
                    }))
                    .await?;
                }
                Envelope::AuthOk(_) | Envelope::AuthFailed(_) | Envelope::Hello(_) | Envelope::HelloAck(_) => {
                    warn!("unexpected envelope after auth");
                }
                _ => {
                    debug!("unhandled envelope (v1 limitation)");
                }
            }
        }
    }

    async fn handle_subscribe(&mut self, s: SubscribeMsg) -> anyhow::Result<()> {
        if !self.validator.has_scope(&self.session.claims, &s.collection) {
            self.write_envelope(Envelope::SubscribeAck(owl_protocol::SubscribeAckMsg {
                subscription_id: s.subscription_id.clone(),
                accepted: false,
                error: Some(owl_protocol::ErrorMsg {
                    code: 403,
                    message: "missing scope".into(),
                    detail: s.collection.clone(),
                }),
                snapshot_revision: 0,
            }))
            .await?;
            return Ok(());
        }

        // Save latest snapshot, then snapshot revision to client.
        let rev = if s.with_snapshot {
            let records = self.records.list_collection(&owl_types::CollectionId::new(s.collection.clone()), &owl_storage::ListFilter::default()).await?;
            let lamport_floor = self.oplog.latest_lamport(&owl_types::CollectionId::new(s.collection.clone())).await?.unwrap_or(owl_types::Lamport::ZERO).0;
            let revision = records.iter().map(|r| r.revision).max().unwrap_or(0);
            let snap = owl_protocol::SnapshotMsg {
                collection: s.collection.clone(),
                revision,
                lamport_floor,
                records,
            };
            self.snapshots.save_snapshot(&owl_types::CollectionId::new(s.collection.clone()), &snap).await?;
            // Send snapshot
            self.write_envelope(Envelope::Snapshot(snap.clone())).await?;
            revision
        } else {
            0
        };

        self.router.subscribe(s.subscription_id.clone(), self.session.clone());
        self.session.add_subscription(s.subscription_id.clone());
        self.write_envelope(Envelope::SubscribeAck(owl_protocol::SubscribeAckMsg {
            subscription_id: s.subscription_id,
            accepted: true,
            error: None,
            snapshot_revision: rev,
        }))
        .await?;
        Ok(())
    }

    async fn handle_unsubscribe(&mut self, u: UnsubscribeMsg) -> anyhow::Result<()> {
        self.router.unsubscribe(&u.subscription_id, self.session.id);
        self.session.remove_subscription(&u.subscription_id);
        Ok(())
    }

    async fn handle_op(&mut self, op: owl_protocol::OperationMsg) -> anyhow::Result<()> {
        // ACL check
        if !self.validator.has_scope(&self.session.claims, &op.collection) {
            self.write_envelope(Envelope::OpAck(owl_protocol::OpAckMsg {
                op_id: op.op_id.clone(),
                accepted: false,
                error: Some(owl_protocol::ErrorMsg { code: 403, message: "missing scope".into(), detail: op.collection.clone() }),
                revision: 0,
            }))
            .await?;
            return Ok(());
        }
        // Idempotency
        let op_uuid = owl_types::OpId(uuid::Uuid::parse_str(&op.op_id)?);
        if self.oplog.has_op(&op_uuid).await? {
            self.write_envelope(Envelope::OpAck(owl_protocol::OpAckMsg {
                op_id: op.op_id.clone(),
                accepted: true,
                error: None,
                revision: 0,
            }))
            .await?;
            return Ok(());
        }
        // Persist
        self.oplog.append_op(&op).await?;
        let coll = owl_types::CollectionId::new(op.collection.clone());
        let rid = owl_types::RecordId::new(op.record_id.clone());
        // Apply op
        let current = self.records.get_record(&coll, &rid).await?;
        let (new, _outcome) = owl_sync::apply_op(current.as_ref(), &op)?;
        if let Some(rec) = new {
            self.records.put_record(&coll, &rec).await?;
        }
        // Fan-out
        let targets = self.router.fan_out(&op);
        for s in targets {
            if s.id == self.session.id { continue; }
            s.observe_lamport(&coll, op.lamport);
            // Note: writing to other sessions' connections from here requires
            // the Connection to be shareable; for v1 we only ACK the sender.
            // Full fan-out transport wiring is in a follow-up.
        }
        // ACK
        self.write_envelope(Envelope::OpAck(owl_protocol::OpAckMsg {
            op_id: op.op_id.clone(),
            accepted: true,
            error: None,
            revision: 0,
        }))
        .await?;
        if let Some(cb) = &self.on_op { cb(op); }
        Ok(())
    }

    async fn read_envelope(&mut self, expected: OpCode) -> anyhow::Result<Envelope> {
        let env = self.read_any_envelope().await?;
        let env = env.ok_or_else(|| anyhow::anyhow!("connection closed before {:?}", expected))?;
        if env.opcode() != expected {
            return Err(anyhow::anyhow!("expected {:?}, got {:?}", expected, env.opcode()));
        }
        Ok(env)
    }

    async fn read_any_envelope(&mut self) -> anyhow::Result<Option<Envelope>> {
        let frame = self.conn.read_frame().await?;
        let Some(frame) = frame else { return Ok(None); };
        let env = Envelope::decode(frame.header.opcode, &frame.payload)?;
        Ok(Some(env))
    }

    async fn write_envelope(&mut self, env: Envelope) -> anyhow::Result<()> {
        let req_id = 0; // server-to-client uses its own counter; for v1 we use 0.
        let bytes = env.encode()?;
        if bytes.len() as u32 > MAX_PAYLOAD_LEN {
            return Err(anyhow::anyhow!("envelope too large to send"));
        }
        let frame = Frame::new(env.opcode(), req_id, Bytes::from(bytes));
        self.conn.write_frame(frame).await?;
        self.conn.flush().await?;
        Ok(())
    }
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
        let session = Session::new(uuid::Uuid::new_v4(), owl_types::DeviceId::new(), owl_auth::Claims {
            device_id: owl_types::DeviceId::new(),
            exp: 0,
            iat: 0,
            collection_scopes: vec![],
            user_id: None,
        });
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
