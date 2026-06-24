/**
 * OSP Browser Client
 * Uses WebSocket + protobuf for browser environments
 */

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
  url: string; // WebSocket URL: ws://localhost:9421
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

type EventHandler = (...args: any[]) => void;

export class OSPBrowserClient {
  private ws: WebSocket | null = null;
  private buffer: Uint8Array = new Uint8Array(0);
  private config: ClientConfig;
  private deviceId: string;
  private connected: boolean = false;
  private authenticated: boolean = false;
  private requestId: bigint = 0n;
  private eventHandlers: Map<string, EventHandler[]> = new Map();

  constructor(config: ClientConfig) {
    this.config = config;
    this.deviceId = config.deviceId || this.generateUUID();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.config.url);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        console.log('[OSP Browser] Connected');
        this.connected = true;
        this.sendHello();
      };

      this.ws.onmessage = (event) => {
        const data = new Uint8Array(event.data);
        this.handleData(data);
      };

      this.ws.onerror = (error) => {
        console.error('[OSP Browser] WebSocket error:', error);
        this.emit('error', error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('[OSP Browser] Disconnected');
        this.connected = false;
        this.authenticated = false;
        this.emit('disconnect');
      };

      // Wait for authentication to complete
      const onAuthOk = () => {
        this.off('auth_failed', onAuthFailed);
        resolve();
      };

      const onAuthFailed = (err: any) => {
        this.off('connect', onAuthOk);
        reject(new Error(`Authentication failed: ${JSON.stringify(err)}`));
      };

      this.once('connect', onAuthOk);
      this.once('auth_failed', onAuthFailed);
    });
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.authenticated = false;
  }

  on(event: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  once(event: string, handler: EventHandler): void {
    const wrapper = (...args: any[]) => {
      this.off(event, wrapper);
      handler(...args);
    };
    this.on(event, wrapper);
  }

  private emit(event: string, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private sendHello(): void {
    const Envelope = osp.v1.Envelope;
    const Hello = osp.v1.Hello;

    const helloMsg = Hello.create({
      protocolVersion: PROTOCOL_VERSION,
      sdkVersion: '0.1.0',
      deviceId: this.deviceId,
      devicePlatform: 'browser',
      capabilities: [
        osp.v1.Capability.CAPABILITY_COMPRESSION_ZSTD,
        osp.v1.Capability.CAPABILITY_CHUNKING,
        osp.v1.Capability.CAPABILITY_RESUME,
      ],
    });

    const envelope = Envelope.create({ hello: helloMsg });
    const payload = new Uint8Array(Envelope.encode(envelope).finish());
    this.sendFrame(OpCode.Hello, payload);
  }

  private sendAuth(): void {
    const Envelope = osp.v1.Envelope;
    const Auth = osp.v1.Auth;

    const authMsg = Auth.create({ token: this.config.token });
    const envelope = Envelope.create({ auth: authMsg });
    const payload = new Uint8Array(Envelope.encode(envelope).finish());
    this.sendFrame(OpCode.Auth, payload);
  }

  private sendFrame(opcode: OpCode, payload: Uint8Array): void {
    if (!this.ws) throw new Error('Not connected');

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

    const encoded = encodeFrame(frame);
    this.ws.send(encoded);
  }

  private handleData(data: Uint8Array): void {
    // Append to buffer
    const newBuffer = new Uint8Array(this.buffer.length + data.length);
    newBuffer.set(this.buffer, 0);
    newBuffer.set(data, this.buffer.length);
    this.buffer = newBuffer;

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
      const envelope = Envelope.decode(frame.payload) as any;

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
          this.sendFrame(OpCode.Pong, new Uint8Array(0));
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
      opId: this.generateUUID(),
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
    this.sendFrame(OpCode.Patch, new Uint8Array(Envelope.encode(envelope).finish()));
  }

  async delete(collection: string, recordId: string): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const op = osp.v1.Operation.create({
      opId: this.generateUUID(),
      deviceId: this.deviceId,
      lamport: Date.now(),
      collection,
      recordId,
      kind: osp.v1.OpKind.OP_KIND_DELETE,
      fieldChanges: [],
      baseClock: osp.v1.VClock.create({ entries: {} }),
      timestampMs: Date.now(),
    });

    this.sendFrame(
      OpCode.Delete,
      new Uint8Array(osp.v1.Envelope.encode(osp.v1.Envelope.create({ op })).finish())
    );
  }

  async restore(collection: string, recordId: string): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const op = osp.v1.Operation.create({
      opId: this.generateUUID(),
      deviceId: this.deviceId,
      lamport: Date.now(),
      collection,
      recordId,
      kind: osp.v1.OpKind.OP_KIND_RESTORE,
      fieldChanges: [],
      baseClock: osp.v1.VClock.create({ entries: {} }),
      timestampMs: Date.now(),
    });

    this.sendFrame(
      OpCode.Restore,
      new Uint8Array(osp.v1.Envelope.encode(osp.v1.Envelope.create({ op })).finish())
    );
  }

  async subscribe(collection: string): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const msg = osp.v1.Subscribe.create({
      subscriptionId: this.generateUUID(),
      collection,
      withSnapshot: true,
    });

    this.sendFrame(
      OpCode.Subscribe,
      new Uint8Array(
        osp.v1.Envelope.encode(osp.v1.Envelope.create({ subscribe: msg })).finish()
      )
    );
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    if (!this.authenticated) throw new Error('Not authenticated');

    const msg = osp.v1.Unsubscribe.create({ subscriptionId });
    this.sendFrame(
      OpCode.Unsubscribe,
      new Uint8Array(
        osp.v1.Envelope.encode(osp.v1.Envelope.create({ unsubscribe: msg })).finish()
      )
    );
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
    if (value instanceof Uint8Array) return Value.create({ bytesValue: value });
    if (Array.isArray(value)) {
      return Value.create({
        arrayValue: osp.v1.ValueArray.create({
          items: value.map((v) => this.toProtoValue(v)),
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
