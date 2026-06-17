/**
 * OSP Frame encoding/decoding
 */

export const MAGIC = Buffer.from('OWL1');
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
  payload: Buffer;
}

export function encodeFrame(frame: Frame): Buffer {
  const header = Buffer.alloc(HEADER_LEN);
  let offset = 0;

  // Magic (4 bytes)
  MAGIC.copy(header, offset);
  offset += 4;

  // Version (2 bytes)
  header.writeUInt16BE(frame.header.version, offset);
  offset += 2;

  // Opcode (2 bytes)
  header.writeUInt16BE(frame.header.opcode, offset);
  offset += 2;

  // Flags (2 bytes)
  header.writeUInt16BE(frame.header.flags, offset);
  offset += 2;

  // Length (4 bytes)
  header.writeUInt32BE(frame.header.length, offset);
  offset += 4;

  // Request ID (8 bytes)
  header.writeBigUInt64BE(frame.header.reqId, offset);

  return Buffer.concat([header, frame.payload]);
}

export function decodeHeader(buffer: Buffer): FrameHeader | null {
  if (buffer.length < HEADER_LEN) {
    return null;
  }

  // Check magic
  const magic = buffer.slice(0, 4);
  if (!magic.equals(MAGIC)) {
    throw new Error('Invalid magic bytes');
  }

  let offset = 4;

  const version = buffer.readUInt16BE(offset);
  offset += 2;

  if (version !== PROTOCOL_VERSION) {
    throw new Error(`Unsupported protocol version: ${version}`);
  }

  const opcode = buffer.readUInt16BE(offset) as OpCode;
  offset += 2;

  const flags = buffer.readUInt16BE(offset);
  offset += 2;

  const length = buffer.readUInt32BE(offset);
  offset += 4;

  const reqId = buffer.readBigUInt64BE(offset);

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

export function decodeFrame(buffer: Buffer): Frame | null {
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
