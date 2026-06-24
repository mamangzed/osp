/**
 * OSP Frame encoding/decoding for Browser
 * Uses Uint8Array instead of Buffer
 */

export const MAGIC = new Uint8Array([79, 87, 76, 49]); // "OWL1"
export const PROTOCOL_VERSION = 1;
export const HEADER_LEN = 22;
export const MAX_PAYLOAD_LEN = 16 * 1024 * 1024; // 16 MB

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
  Delete = 0x0A,
  Restore = 0x0B,
  Sync = 0x0C,
  Ack = 0x0D,
  Heartbeat = 0x0E,
  Error = 0x0F,
  Presence = 0x10,
  Ping = 0x11,
  Pong = 0x12,
}

export const FLAG_COMPRESSED = 1 << 0;
export const FLAG_CHUNK = 1 << 1;
export const FLAG_CHUNK_LAST = 1 << 2;

export interface FrameHeader {
  opcode: OpCode;
  version: number;
  flags: number;
  length: number;
  reqId: bigint;
}

export interface Frame {
  header: FrameHeader;
  payload: Uint8Array;
}

export function encodeFrame(frame: Frame): Uint8Array {
  const header = new Uint8Array(HEADER_LEN);
  const view = new DataView(header.buffer, header.byteOffset, HEADER_LEN);
  let offset = 0;

  // Magic (4 bytes)
  header.set(MAGIC, offset);
  offset += 4;

  // Version (2 bytes)
  view.setUint16(offset, frame.header.version, false);
  offset += 2;

  // Opcode (2 bytes)
  view.setUint16(offset, frame.header.opcode, false);
  offset += 2;

  // Flags (2 bytes)
  view.setUint16(offset, frame.header.flags, false);
  offset += 2;

  // Length (4 bytes)
  view.setUint32(offset, frame.header.length, false);
  offset += 4;

  // Request ID (8 bytes)
  view.setBigUint64(offset, frame.header.reqId, false);

  // Combine header and payload
  const result = new Uint8Array(HEADER_LEN + frame.payload.length);
  result.set(header, 0);
  result.set(frame.payload, HEADER_LEN);

  return result;
}

export function decodeHeader(buffer: Uint8Array): FrameHeader | null {
  if (buffer.length < HEADER_LEN) {
    return null;
  }

  const view = new DataView(buffer.buffer, buffer.byteOffset, HEADER_LEN);

  // Check magic
  for (let i = 0; i < 4; i++) {
    if (buffer[i] !== MAGIC[i]) {
      throw new Error('Invalid magic bytes');
    }
  }

  let offset = 4;

  const version = view.getUint16(offset, false);
  offset += 2;

  if (version !== PROTOCOL_VERSION) {
    throw new Error(`Unsupported protocol version: ${version}`);
  }

  const opcode = view.getUint16(offset, false) as OpCode;
  offset += 2;

  const flags = view.getUint16(offset, false);
  offset += 2;

  const length = view.getUint32(offset, false);
  offset += 4;

  const reqId = view.getBigUint64(offset, false);

  if (length > MAX_PAYLOAD_LEN) {
    throw new Error(`Payload too large: ${length}`);
  }

  return {
    opcode,
    version,
    flags,
    length,
    reqId,
  };
}

export function decodeFrame(buffer: Uint8Array): Frame | null {
  const header = decodeHeader(buffer);
  if (!header) {
    return null;
  }

  const totalLen = HEADER_LEN + header.length;
  if (buffer.length < totalLen) {
    return null;
  }

  const payload = buffer.slice(HEADER_LEN, totalLen);

  return {
    header,
    payload,
  };
}
