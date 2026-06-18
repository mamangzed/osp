/**
 * OSP Client for Node.js
 * Uses protobufjs for binary serialization
 */

import * as net from 'net';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { osp } from './osp_pb';
import {
  Frame,
  OpCode,
  encodeFrame,
  decodeFrame,
  HEADER_LEN,
  PROTOCOL_VERSION,
} from './frame';

export interface ClientConfig {
  host: string;
  port: number;
  token: string;
  deviceId?: string;
}

export interface OspRecord {
  collection: string;
  recordId: string;
  revision: number;
  fields: Record<string, any>;
  tombstone: boolean;
}

export interface Operation {
  opId: string;
  deviceId: string;
  lamport: number;
  collection: string;
  recordId: string;
  kind: 'insert' | 'update' | 'delete' | 'restore';
  fieldChanges: Array<{
    fieldName: string;
    newValue: any;
    lamport: number;
    writerDeviceId: string;
  }>;
  timestamp: number;
}

// Protobuf type aliases
type Envelope = osp.v1.Envelope;
type IEnvelope = osp.v1.IEnvelope;

export class OSPClient extends EventEmitter {
  private socket: net.Socket | null = null;
  private buffer: Buffer = Buffer.alloc(0);
  private config: ClientConfig;
  private deviceId: string;
  private connected: boolean = false;
  private authenticated: boolean = false;
  private requestId: bigint = 0n;

  constructor(config: ClientConfig) {
    super();
    this.config = config;
    this.deviceId = config.deviceId || uuidv4();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new net.Socket();

      this.socket.on('data', (data) => this.handleData(data));

      this.socket.on('error', (err) => {
        this.emit('error', err);
        reject(err);
      });

      this.socket.on('close', () => {
        this.connected = false;
        this.authenticated = false;
        this.emit('disconnect');
      });

      this.socket.connect(this.config.port, this.config.host, () => {
        this.connected = true;
        this.sendHello();
      });

      // Wait for authentication to complete
      const onAuthOk = () => {
        this.removeListener('auth_failed', onAuthFailed);
        resolve();
      };

      const onAuthFailed = (err: any) => {
        this.removeListener('connect', onAuthOk);
        reject(new Error(`Authentication failed: ${JSON.stringify(err)}`));
      };

      this.once('connect', onAuthOk);
      this.once('auth_failed', onAuthFailed);
    });
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
    this.connected = false;
    this.authenticated = false;
  }

  private sendHello(): void {
    const Envelope = osp.v1.Envelope;
    const Hello = osp.v1.Hello;

    const helloMsg = Hello.create({
      protocolVersion: PROTOCOL_VERSION,
      sdkVersion: '0.1.0',
      deviceId: this.deviceId,
      devicePlatform: 'nodejs',
      capabilities: [
        osp.v1.Capability.CAPABILITY_COMPRESSION_ZSTD,
        osp.v1.Capability.CAPABILITY_CHUNKING,
        osp.v1.Capability.CAPABILITY_RESUME,
      ],
    });

    const envelope = Envelope.create({ hello: helloMsg });
    const payload = Buffer.from(Envelope.encode(envelope).finish());
    this.sendFrame(OpCode.Hello, payload);
  }

  private sendAuth(): void {
    const Envelope = osp.v1.Envelope;
    const Auth = osp.v1.Auth;

    const authMsg = Auth.create({ token: this.config.token });
    const envelope = Envelope.create({ auth: authMsg });
    const payload = Buffer.from(Envelope.encode(envelope).finish());
    this.sendFrame(OpCode.Auth, payload);
  }

  private sendFrame(opcode: OpCode, payload: Buffer): void {
    if (!this.socket) throw new Error('Not connected');

    const frame: Frame = {
      header: {
        opcode,
        version: PROTOCOL_VERSION,
        flags: 0,
        length: payload.length,
        reqId: this.requestId++,
      },
      payload,
    };

    this.socket.write(encodeFrame(frame));
  }

  private handleData(data: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, data]);

    while (this.buffer.length >= HEADER_LEN) {
      const frame = decodeFrame(this.buffer);
      if (!frame) break;

      this.buffer = this.buffer.slice(HEADER_LEN + frame.header.length);
      this.handleFrame(frame);
    }
  }

  private handleFrame(frame: Frame): void {
    try {
      const Envelope = osp.v1.Envelope;
      const envelope = Envelope.decode(frame.payload) as Envelope;

      switch (frame.header.opcode) {
        case OpCode.HelloAck:
          if (envelope.helloAck) {
            this.emit('hello_ack', envelope.helloAck);
            this.sendAuth();
          }
          break;

        case OpCode.AuthOk:
          if (envelope.authOk) {
            this.authenticated = true;
            this.emit('connect', envelope.authOk);
          }
          break;

        case OpCode.AuthFailed:
          if (envelope.authFailed) {
            this.emit('auth_failed', envelope.authFailed);
            this.disconnect();
          }
          break;

        case OpCode.Patch:
          if (envelope.op) this.emit('patch', envelope.op);
          break;

        case OpCode.Delete:
          if (envelope.op) this.emit('delete', envelope.op);
          break;

        case OpCode.Restore:
          if (envelope.op) this.emit('restore', envelope.op);
          break;

        case OpCode.Ping:
          this.sendFrame(OpCode.Pong, Buffer.alloc(0));
          break;

        case OpCode.Error:
          if (envelope.error) {
            this.emit('error', new Error(envelope.error.message || 'Server error'));
          }
          break;

        default:
          this.emit('unhandled', frame.header.opcode, envelope);
      }
    } catch (err) {
      this.emit('error', err);
    }
  }

  async set(collection: string, recordId: string, fields: Record<string, any>): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const Envelope = osp.v1.Envelope;
    const Operation = osp.v1.Operation;
    const FieldChange = osp.v1.FieldChange;

    const fieldChanges = Object.entries(fields).map(([fieldName, newValue]) =>
      FieldChange.create({
        fieldName,
        newValue: this.toProtoValue(newValue),
        lamport: Date.now(),
        writerDeviceId: this.deviceId,
      })
    );

    const op = Operation.create({
      opId: uuidv4(),
      deviceId: this.deviceId,
      lamport: Date.now(),
      collection,
      recordId,
      kind: osp.v1.OpKind.OP_KIND_UPDATE,
      fieldChanges,
      baseClock: osp.v1.VClock.create({ entries: {} }),
      timestampMs: Date.now(),
    });

    const envelope = Envelope.create({ op });
    this.sendFrame(OpCode.Patch, Buffer.from(Envelope.encode(envelope).finish()));
  }

  async delete(collection: string, recordId: string): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const op = osp.v1.Operation.create({
      opId: uuidv4(),
      deviceId: this.deviceId,
      lamport: Date.now(),
      collection,
      recordId,
      kind: osp.v1.OpKind.OP_KIND_DELETE,
      fieldChanges: [],
      baseClock: osp.v1.VClock.create({ entries: {} }),
      timestampMs: Date.now(),
    });

    this.sendFrame(OpCode.Delete, Buffer.from(osp.v1.Envelope.encode(osp.v1.Envelope.create({ op })).finish()));
  }

  async restore(collection: string, recordId: string): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const op = osp.v1.Operation.create({
      opId: uuidv4(),
      deviceId: this.deviceId,
      lamport: Date.now(),
      collection,
      recordId,
      kind: osp.v1.OpKind.OP_KIND_RESTORE,
      fieldChanges: [],
      baseClock: osp.v1.VClock.create({ entries: {} }),
      timestampMs: Date.now(),
    });

    this.sendFrame(OpCode.Restore, Buffer.from(osp.v1.Envelope.encode(osp.v1.Envelope.create({ op })).finish()));
  }

  async subscribe(collection: string): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const msg = osp.v1.Subscribe.create({
      subscriptionId: uuidv4(),
      collection,
      withSnapshot: true,
    });

    this.sendFrame(OpCode.Subscribe, Buffer.from(osp.v1.Envelope.encode(osp.v1.Envelope.create({ subscribe: msg })).finish()));
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const msg = osp.v1.Unsubscribe.create({ subscriptionId });
    this.sendFrame(OpCode.Unsubscribe, Buffer.from(osp.v1.Envelope.encode(osp.v1.Envelope.create({ unsubscribe: msg })).finish()));
  }

  private toProtoValue(value: any): osp.v1.Value {
    const Value = osp.v1.Value;
    if (value === null || value === undefined) return Value.create({ nullValue: true });
    if (typeof value === 'boolean') return Value.create({ boolValue: value });
    if (typeof value === 'number') {
      return Number.isInteger(value)
        ? Value.create({ intValue: value })
        : Value.create({ doubleValue: value });
    }
    if (typeof value === 'string') return Value.create({ stringValue: value });
    if (Buffer.isBuffer(value) || value instanceof Uint8Array) return Value.create({ bytesValue: value });
    if (Array.isArray(value)) {
      return Value.create({
        arrayValue: osp.v1.ValueArray.create({
          items: value.map(v => this.toProtoValue(v)),
        }),
      });
    }
    if (typeof value === 'object') {
      const entries: Record<string, osp.v1.Value> = {};
      for (const [k, v] of Object.entries(value)) entries[k] = this.toProtoValue(v);
      return Value.create({
        objectValue: osp.v1.ValueMap.create({ entries }),
      });
    }
    return Value.create({ nullValue: true });
  }

  isConnected(): boolean {
    return this.connected && this.authenticated;
  }
}
