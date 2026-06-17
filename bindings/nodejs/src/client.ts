/**
 * OSP Client SDK - High-level API
 */

import { v4 as uuidv4 } from 'uuid';
import { connectTcp, connectTls, Connection } from './transport';
import {
  Frame,
  Envelope,
  OpCode,
  PROTOCOL_VERSION,
  FLAG_COMPRESSED,
  FLAG_CHUNK,
} from './protocol';
import {
  HelloMsg,
  HelloAckMsg,
  AuthMsg,
  AuthOkMsg,
  SubscribeMsg,
  UnsubscribeMsg,
  OperationMsg,
  RecordMsg,
  Value,
  CollectionId,
  RecordId,
  DeviceId,
  Capability,
  Predicate,
} from './types';
import { SyncEngine } from './engine';

export interface ClientConfig {
  url: string;
  token: string;
  deviceId?: DeviceId;
  heartbeatIntervalMs?: number;
  reconnectMaxAttempts?: number;
}

export class OwlClient {
  private config: ClientConfig;
  private engine: SyncEngine;
  private connection: Connection | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private readLoopPromise: Promise<void> | null = null;
  private isRunning = false;
  private reqId = 0n;

  constructor(config: ClientConfig) {
    this.config = config;
    this.engine = new SyncEngine(config.deviceId || uuidv4());
  }

  async connect(): Promise<void> {
    const url = new URL(this.config.url);
    const host = url.hostname;
    const port = parseInt(url.port || (url.protocol === 'tls:' ? '443' : '9420'), 10);

    if (url.protocol === 'tls:') {
      this.connection = await connectTls(host, port);
    } else {
      this.connection = await connectTcp(host, port);
    }

    await this.handshake();
    this.isRunning = true;
    this.startHeartbeat();
    this.readLoopPromise = this.readLoop();
  }

  private async handshake(): Promise<void> {
    if (!this.connection) throw new Error('Not connected');

    const hello: HelloMsg = {
      protocol_version: PROTOCOL_VERSION,
      sdk_version: 'owl-nodejs/0.1.0',
      device_id: this.config.deviceId || uuidv4(),
      device_platform: process.platform,
      capabilities: [Capability.CompressionZstd, Capability.Chunking, Capability.Resume],
    };

    await this.writeEnvelope(new Envelope({ type: 'Hello', data: hello }));

    const helloAckEnv = await this.readEnvelope();
    if (!helloAckEnv || helloAckEnv.payload.type !== 'HelloAck') {
      throw new Error('Expected HELLO_ACK');
    }
    const helloAck = helloAckEnv.payload.data as HelloAckMsg;

    const auth: AuthMsg = { token: this.config.token };
    await this.writeEnvelope(new Envelope({ type: 'Auth', data: auth }));

    const authEnv = await this.readEnvelope();
    if (!authEnv || authEnv.payload.type === 'AuthFailed') {
      const err = authEnv?.payload.type === 'AuthFailed' ? authEnv.payload.data : null;
      throw new Error(`Auth failed: ${err?.message || 'Unknown'}`);
    }
    if (authEnv.payload.type !== 'AuthOk') {
      throw new Error('Expected AUTH_OK');
    }
  }

  private async writeEnvelope(env: Envelope): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    this.reqId++;
    const payload = env.encode();
    const frame = Frame.create(env.opcode, this.reqId, payload);
    await this.connection.writeFrame(frame);
  }

  private async readEnvelope(): Promise<Envelope | null> {
    if (!this.connection) return null;
    const frame = await this.connection.readFrame();
    if (!frame) return null;
    return Envelope.decode(frame.header.opcode, frame.payload);
  }

  private startHeartbeat() {
    const interval = this.config.heartbeatIntervalMs || 15000;
    this.heartbeatTimer = setInterval(async () => {
      if (!this.connection) return;
      try {
        await this.writeEnvelope(new Envelope({ type: 'Ping', data: { protocol_version: 1, sdk_version: '', device_id: '', device_platform: '', capabilities: [] } }));
      } catch {
        // Ignore ping errors, reconnect will handle it
      }
    }, interval);
  }

  private async readLoop() {
    while (this.isRunning && this.connection) {
      const env = await this.readEnvelope();
      if (!env) {
        this.isRunning = false;
        break;
      }

      switch (env.payload.type) {
        case 'Pong':
          break;
        case 'Op':
          this.engine.applyRemote(env.payload.data as OperationMsg);
          break;
        case 'SyncPush':
          const push = env.payload.data as { ops: OperationMsg[] };
          for (const op of push.ops) {
            this.engine.applyRemote(op);
          }
          break;
        case 'Record':
          // Handled via subscription or direct get
          break;
        case 'Snapshot':
          // TODO: Apply snapshot
          break;
        case 'OpAck':
          // TODO: Mark op as acked
          break;
        default:
          // Ignore or log
          break;
      }
    }
  }

  async set(coll: CollectionId, recordId: RecordId, field: string, value: Value): Promise<OperationMsg> {
    const op = this.engine.localSetField(coll, recordId, field, value);
    await this.writeEnvelope(new Envelope({ type: 'Op', data: op }));
    return op;
  }

  async delete(coll: CollectionId, recordId: RecordId): Promise<OperationMsg> {
    const op = this.engine.localDelete(coll, recordId);
    await this.writeEnvelope(new Envelope({ type: 'Op', data: op }));
    return op;
  }

  async restore(coll: CollectionId, recordId: RecordId): Promise<OperationMsg> {
    const op = this.engine.localRestore(coll, recordId);
    await this.writeEnvelope(new Envelope({ type: 'Op', data: op }));
    return op;
  }

  get(coll: CollectionId, recordId: RecordId): RecordMsg | null {
    return this.engine.getRecord(coll, recordId);
  }

  async subscribe(coll: CollectionId, predicate?: Predicate, withSnapshot = true): Promise<string> {
    const subscriptionId = uuidv4();
    const msg: SubscribeMsg = {
      subscription_id: subscriptionId,
      collection: coll,
      predicate: predicate || null,
      limit: 0,
      with_snapshot: withSnapshot,
    };
    await this.writeEnvelope(new Envelope({ type: 'Subscribe', data: msg }));
    return subscriptionId;
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    const msg: UnsubscribeMsg = { subscription_id: subscriptionId };
    await this.writeEnvelope(new Envelope({ type: 'Unsubscribe', data: msg }));
  }

  disconnect() {
    this.isRunning = false;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  }
}
