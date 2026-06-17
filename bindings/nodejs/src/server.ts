/**
 * OSP Server SDK - TCP + WebSocket server with session management
 */

import * as net from 'net';
import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Connection } from './transport';
import { Frame, Envelope, OpCode, PROTOCOL_VERSION } from './protocol';
import {
  HelloMsg,
  HelloAckMsg,
  AuthMsg,
  AuthOkMsg,
  AuthFailedMsg,
  SubscribeMsg,
  OperationMsg,
  OpAckMsg,
  RecordMsg,
  Capability,
  SessionId,
  DeviceId,
  CollectionId,
} from './types';
import { SyncEngine } from './engine';

export interface ServerConfig {
  port: number;
  host?: string;
  wsPort?: number; // Optional: WebSocket port (default: port + 1)
  heartbeatIntervalMs?: number;
  validateToken?: (token: string) => { valid: boolean; deviceId?: DeviceId; scopes?: string[] };
}

interface Session {
  sessionId: SessionId;
  deviceId: DeviceId;
  connection: Connection;
  subscriptions: Map<string, CollectionId>;
  lastLamportSeen: number;
}

export class OwlServer {
  private config: ServerConfig;
  private engine: SyncEngine;
  private server: net.Server | null = null;
  private wsServer: WebSocketServer | null = null;
  private httpServer: http.Server | null = null;
  private sessions: Map<SessionId, Session> = new Map();
  private heartbeatTimers: Map<SessionId, NodeJS.Timeout> = new Map();

  constructor(config: ServerConfig) {
    this.config = config;
    this.engine = new SyncEngine('server');
  }

  async listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      // TCP Server
      this.server = net.createServer((socket) => {
        socket.setNoDelay(true);
        const conn = new Connection(socket);
        this.handleConnection(conn).catch((err) => {
          console.error('TCP Connection error:', err);
          socket.end();
        });
      });

      this.server.on('error', reject);
      this.server.listen(this.config.port, this.config.host || '0.0.0.0', () => {
        console.log(`✅ OSP TCP Server listening on ${this.config.host || '0.0.0.0'}:${this.config.port}`);

        // WebSocket Server (optional)
        if (this.config.wsPort !== undefined || this.config.wsPort === 0) {
          const wsPort = this.config.wsPort || (this.config.port + 1);
          this.httpServer = http.createServer();
          this.wsServer = new WebSocketServer({ server: this.httpServer });

          this.wsServer.on('connection', (ws: WebSocket) => {
            // Wrap WebSocket to be compatible with Connection interface
            const socketLike = {
              on: (event: string, cb: any) => {
                if (event === 'data') {
                  ws.on('message', (data: Buffer | ArrayBuffer) => {
                    cb(Buffer.from(data));
                  });
                }
                if (event === 'end') {
                  ws.on('close', cb);
                }
                if (event === 'error') {
                  ws.on('error', cb);
                }
              },
              write: (data: Buffer, cb?: () => void) => {
                ws.send(data, { binary: true }, cb);
              },
              end: () => ws.close(),
              setNoDelay: () => {} // WebSocket already optimal
            } as any;

            const conn = new Connection(socketLike);
            this.handleConnection(conn).catch((err) => {
              console.error('WebSocket Connection error:', err);
              ws.close();
            });
          });

          this.httpServer.listen(wsPort, this.config.host || '0.0.0.0', () => {
            console.log(`✅ OSP WebSocket Server listening on ${this.config.host || '0.0.0.0'}:${wsPort}`);
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  private async handleConnection(connection: Connection): Promise<void> {
    // Read HELLO
    const helloFrame = await connection.readFrame();
    if (!helloFrame || helloFrame.header.opcode !== OpCode.Hello) {
      connection.close();
      return;
    }

    const helloEnv = Envelope.decode(helloFrame.header.opcode, helloFrame.payload);
    if (helloEnv.payload.type !== 'Hello') {
      connection.close();
      return;
    }
    const hello = helloEnv.payload.data as HelloMsg;

    // Send HELLO_ACK
    const sessionId = uuidv4() as SessionId;
    const ack: HelloAckMsg = {
      protocol_version: PROTOCOL_VERSION,
      server_version: 'owl-nodejs-server/0.1.0',
      session_id: sessionId,
      heartbeat_interval_ms: this.config.heartbeatIntervalMs || 15000,
      selected_capabilities: hello.capabilities.filter(
        (c) => c === Capability.Chunking || c === Capability.Resume
      ),
      snapshot_window: 10000,
    };

    let reqId = 0n;
    const writeEnv = async (env: Envelope) => {
      reqId++;
      const payload = env.encode();
      const frame = Frame.create(env.opcode, reqId, payload);
      await connection.writeFrame(frame);
    };

    await writeEnv(new Envelope({ type: 'HelloAck', data: ack }));

    // Read AUTH
    const authFrame = await connection.readFrame();
    if (!authFrame || authFrame.header.opcode !== OpCode.Auth) {
      connection.close();
      return;
    }

    const authEnv = Envelope.decode(authFrame.header.opcode, authFrame.payload);
    if (authEnv.payload.type !== 'Auth') {
      connection.close();
      return;
    }
    const auth = authEnv.payload.data as AuthMsg;

    // Validate token
    const validator = this.config.validateToken || ((token: string) => ({ valid: token.length > 0, deviceId: undefined, scopes: ['*'] }));
    const authResult = validator(auth.token);

    if (!authResult.valid) {
      const failed: AuthFailedMsg = { code: 401, message: 'Unauthorized', detail: 'Invalid token' };
      await writeEnv(new Envelope({ type: 'AuthFailed', data: failed }));
      connection.close();
      return;
    }

    const deviceId = authResult.deviceId || hello.device_id || uuidv4();
    const authOk: AuthOkMsg = { device_id: deviceId, collection_scopes: authResult.scopes || ['*'] };
    await writeEnv(new Envelope({ type: 'AuthOk', data: authOk }));

    // Register session
    const session: Session = {
      sessionId,
      deviceId,
      connection,
      subscriptions: new Map(),
      lastLamportSeen: 0,
    };
    this.sessions.set(sessionId, session);

    // Start heartbeat
    const hbInterval = setInterval(async () => {
      try {
        await writeEnv(new Envelope({ type: 'Pong', data: { protocol_version: 1, sdk_version: '', device_id: '', device_platform: '', capabilities: [] } }));
      } catch {
        clearInterval(hbInterval);
      }
    }, this.config.heartbeatIntervalMs || 15000);
    this.heartbeatTimers.set(sessionId, hbInterval);

    // Read loop
    try {
      while (true) {
        const frame = await connection.readFrame();
        if (!frame) break;

        const env = Envelope.decode(frame.header.opcode, frame.payload);
        await this.handleEnvelope(session, env, writeEnv);
      }
    } catch {
      // Connection closed
    } finally {
      this.removeSession(sessionId);
    }
  }

  private async handleEnvelope(
    session: Session,
    env: Envelope,
    writeEnv: (env: Envelope) => Promise<void>
  ): Promise<void> {
    switch (env.payload.type) {
      case 'Subscribe': {
        const msg = env.payload.data as SubscribeMsg;
        session.subscriptions.set(msg.subscription_id, msg.collection);

        const subAck = {
          subscription_id: msg.subscription_id,
          accepted: true,
          error: null,
          snapshot_revision: 0,
        };
        await writeEnv(new Envelope({ type: 'SubscribeAck', data: subAck }));

        // Send snapshot if requested
        if (msg.with_snapshot) {
          const records = this.engine.listRecords(msg.collection, msg.predicate || undefined);
          const snapshot = {
            collection: msg.collection,
            revision: 0,
            lamport_floor: 0,
            records,
          };
          await writeEnv(new Envelope({ type: 'Snapshot', data: snapshot }));
        }
        break;
      }

      case 'Unsubscribe': {
        const msg = env.payload.data as { subscription_id: string };
        session.subscriptions.delete(msg.subscription_id);
        break;
      }

      case 'Op': {
        const op = env.payload.data as OperationMsg;
        const applied = this.engine.applyRemote(op);

        const opAck: OpAckMsg = {
          op_id: op.op_id,
          accepted: applied,
          error: null,
          revision: 0,
        };
        await writeEnv(new Envelope({ type: 'OpAck', data: opAck }));

        // Fan-out to other subscribed sessions
        if (applied) {
          this.fanOut(session.sessionId, op);
        }
        break;
      }

      case 'Ping': {
        await writeEnv(new Envelope({ type: 'Pong', data: env.payload.data }));
        break;
      }
    }
  }

  private async fanOut(senderSessionId: SessionId, op: OperationMsg): Promise<void> {
    const pushEnv = new Envelope({ type: 'SyncPush', data: { ops: [op] } });
    const payload = pushEnv.encode();

    for (const [sid, session] of this.sessions) {
      if (sid === senderSessionId) continue;
      if (!session.subscriptions.has(op.collection)) continue;

      try {
        const frame = Frame.create(pushEnv.opcode, 0n, payload);
        await session.connection.writeFrame(frame);
      } catch {
        // Session disconnected
      }
    }
  }

  private removeSession(sessionId: SessionId) {
    this.sessions.delete(sessionId);
    const timer = this.heartbeatTimers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(sessionId);
    }
  }

  close() {
    for (const timer of this.heartbeatTimers.values()) {
      clearInterval(timer);
    }
    this.heartbeatTimers.clear();
    this.sessions.clear();

    // Close all active connections
    for (const session of this.sessions.values()) {
      session.connection.close();
    }

    if (this.server) {
      this.server.close();
      this.server = null;
    }
    if (this.wsServer) {
      this.wsServer.close();
      this.wsServer = null;
    }
    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = null;
    }
  }
}
