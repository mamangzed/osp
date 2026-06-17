/**
 * OSP Wire Protocol - 22-byte fixed header + JSON payload
 */

import {
  HelloMsg,
  HelloAckMsg,
  AuthMsg,
  AuthOkMsg,
  AuthFailedMsg,
  SubscribeMsg,
  UnsubscribeMsg,
  SubscribeAckMsg,
  OperationMsg,
  OpAckMsg,
  SyncPushMsg,
  SyncPullRequestMsg,
  SyncPullResponseMsg,
  SnapshotMsg,
  RecordMsg,
  ErrorMsg,
  PresenceMsg,
} from './types';

export const MAGIC = Buffer.from('OWL1');
export const PROTOCOL_VERSION = 1;
export const MAX_PAYLOAD_LEN = 16 * 1024 * 1024; // 16 MiB
export const HEADER_LEN = 22;

export const FLAG_COMPRESSED = 1 << 0;
export const FLAG_CHUNK = 1 << 1;
export const FLAG_CHUNK_LAST = 1 << 2;

export enum OpCode {
  Hello = 0x01,
  HelloAck = 0x02,
  Auth = 0x03,
  AuthOk = 0x04,
  AuthFailed = 0x05,
  Subscribe = 0x06,
  SubscribeAck = 0x07,
  Unsubscribe = 0x08,
  Patch = 0x09,
  Delete = 0x0a,
  Restore = 0x0b,
  Sync = 0x0c,
  Ack = 0x0d,
  Heartbeat = 0x0e,
  Error = 0x0f,
  Presence = 0x10,
  Ping = 0x11,
  Pong = 0x12,
}

export interface FrameHeaderData {
  opcode: OpCode;
  version: number;
  flags: number;
  length: number;
  req_id: bigint;
}

export class FrameHeader {
  constructor(
    public opcode: OpCode,
    public version: number = PROTOCOL_VERSION,
    public flags: number = 0,
    public length: number = 0,
    public req_id: bigint = 0n
  ) {}

  encode(): Buffer {
    const buf = Buffer.alloc(HEADER_LEN);
    MAGIC.copy(buf, 0);
    buf.writeUInt16BE(this.version, 4);
    buf.writeUInt16BE(this.opcode, 6);
    buf.writeUInt16BE(this.flags, 8);
    buf.writeUInt32BE(this.length, 10);
    // Node.js Buffer writeBigUInt64BE
    buf.writeBigUInt64BE(this.req_id, 14);
    return buf;
  }

  static decode(buf: Buffer): FrameHeader {
    if (buf.length < HEADER_LEN) {
      throw new Error('Incomplete header');
    }
    const magic = buf.subarray(0, 4);
    if (!magic.equals(MAGIC)) {
      throw new Error(`Bad magic: ${magic.toString('hex')}`);
    }
    const version = buf.readUInt16BE(4);
    const opcodeRaw = buf.readUInt16BE(6);
    const flags = buf.readUInt16BE(8);
    const length = buf.readUInt32BE(10);
    const req_id = buf.readBigUInt64BE(14);

    if (version !== PROTOCOL_VERSION) {
      throw new Error(`Bad version: ${version}`);
    }
    const opcode = Object.values(OpCode).includes(opcodeRaw as OpCode)
      ? (opcodeRaw as OpCode)
      : OpCode.Error;

    if (length > MAX_PAYLOAD_LEN) {
      throw new Error(`Payload too large: ${length}`);
    }

    return new FrameHeader(opcode, version, flags, length, req_id);
  }
}

export class Frame {
  constructor(
    public header: FrameHeader,
    public payload: Buffer
  ) {}

  static create(opcode: OpCode, req_id: bigint, payload: Buffer, flags: number = 0): Frame {
    return new Frame(
      new FrameHeader(opcode, PROTOCOL_VERSION, flags, payload.length, req_id),
      payload
    );
  }

  isCompressed(): boolean {
    return (this.header.flags & FLAG_COMPRESSED) !== 0;
  }

  isChunk(): boolean {
    return (this.header.flags & FLAG_CHUNK) !== 0;
  }

  isChunkLast(): boolean {
    return (this.header.flags & FLAG_CHUNK_LAST) !== 0;
  }
}

export type EnvelopePayload =
  | { type: 'Hello'; data: HelloMsg }
  | { type: 'HelloAck'; data: HelloAckMsg }
  | { type: 'Auth'; data: AuthMsg }
  | { type: 'AuthOk'; data: AuthOkMsg }
  | { type: 'AuthFailed'; data: AuthFailedMsg }
  | { type: 'Subscribe'; data: SubscribeMsg }
  | { type: 'Unsubscribe'; data: UnsubscribeMsg }
  | { type: 'SubscribeAck'; data: SubscribeAckMsg }
  | { type: 'Op'; data: OperationMsg }
  | { type: 'OpAck'; data: OpAckMsg }
  | { type: 'SyncPush'; data: SyncPushMsg }
  | { type: 'SyncPullRequest'; data: SyncPullRequestMsg }
  | { type: 'SyncPullResponse'; data: SyncPullResponseMsg }
  | { type: 'Snapshot'; data: SnapshotMsg }
  | { type: 'Record'; data: RecordMsg }
  | { type: 'Error'; data: ErrorMsg }
  | { type: 'Ping'; data: HelloMsg }
  | { type: 'Pong'; data: HelloMsg }
  | { type: 'Presence'; data: PresenceMsg };

export class Envelope {
  constructor(public payload: EnvelopePayload) {}

  get opcode(): OpCode {
    switch (this.payload.type) {
      case 'Hello': return OpCode.Hello;
      case 'HelloAck': return OpCode.HelloAck;
      case 'Auth': return OpCode.Auth;
      case 'AuthOk': return OpCode.AuthOk;
      case 'AuthFailed': return OpCode.AuthFailed;
      case 'Subscribe': return OpCode.Subscribe;
      case 'Unsubscribe': return OpCode.Unsubscribe;
      case 'SubscribeAck': return OpCode.SubscribeAck;
      case 'Op': return OpCode.Patch;
      case 'OpAck': return OpCode.Ack;
      case 'SyncPush':
      case 'SyncPullRequest':
      case 'SyncPullResponse':
      case 'Snapshot':
      case 'Record':
        return OpCode.Sync;
      case 'Error': return OpCode.Error;
      case 'Ping': return OpCode.Ping;
      case 'Pong': return OpCode.Pong;
      case 'Presence': return OpCode.Presence;
      default: return OpCode.Error;
    }
  }

  encode(): Buffer {
    return Buffer.from(JSON.stringify(this.payload));
  }

  static decode(opcode: OpCode, buf: Buffer): Envelope {
    const parsed = JSON.parse(buf.toString('utf8'));
    if (!parsed || typeof parsed.type !== 'string') {
      throw new Error('Invalid envelope JSON');
    }
    return new Envelope(parsed as EnvelopePayload);
  }
}
