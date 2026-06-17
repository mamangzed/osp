/**
 * OSP Transport Layer - TCP connection with chunking
 */

import * as net from 'net';
import * as tls from 'tls';
import { Frame, FrameHeader, FrameHeaderData, HEADER_LEN, MAX_PAYLOAD_LEN, FLAG_CHUNK, FLAG_CHUNK_LAST } from './protocol';

interface ChunkState {
  id: number;
  accumulated: Buffer[];
  opcode: number;
  req_id: bigint;
  flags: number;
}

export class Connection {
  private socket: net.Socket | tls.TLSSocket;
  private readBuffer: Buffer = Buffer.alloc(0);
  private readResolver: ((frame: Frame | null) => void) | null = null;
  private writeQueue: { frame: Frame; resolver: () => void }[] = [];
  private writing = false;
  private chunkState: ChunkState | null = null;
  private nextChunkId = 0;

  constructor(socket: net.Socket | tls.TLSSocket) {
    this.socket = socket;
    this.socket.on('data', this.handleData.bind(this));
    this.socket.on('end', () => this.resolveRead(null));
    this.socket.on('error', () => this.resolveRead(null));
  }

  private resolveRead(frame: Frame | null) {
    if (this.readResolver) {
      const resolver = this.readResolver;
      this.readResolver = null;
      resolver(frame);
    }
  }

  private handleData(data: Buffer) {
    this.readBuffer = Buffer.concat([this.readBuffer, data]);
    this.processBuffer();
  }

  private processBuffer() {
    while (this.readBuffer.length >= HEADER_LEN) {
      const header = FrameHeader.decode(this.readBuffer);
      const totalLen = HEADER_LEN + header.length;

      if (this.readBuffer.length < totalLen) {
        return; // Wait for more data
      }

      const payload = this.readBuffer.subarray(HEADER_LEN, totalLen);
      this.readBuffer = this.readBuffer.subarray(totalLen);

      // Handle chunking
      if ((header.flags & FLAG_CHUNK) !== 0) {
        if (payload.length < 4) {
          continue; // Invalid chunk
        }
        const chunkId = payload.readUInt32BE(0);
        const body = payload.subarray(4);
        const isLast = (header.flags & FLAG_CHUNK_LAST) !== 0;

        if (!this.chunkState || this.chunkState.id !== chunkId) {
          this.chunkState = {
            id: chunkId,
            accumulated: [body],
            opcode: header.opcode,
            req_id: header.req_id,
            flags: header.flags,
          };
        } else {
          this.chunkState.accumulated.push(body);
        }

        if (isLast) {
          const assembled = Buffer.concat(this.chunkState.accumulated);
          this.chunkState = null;
          const frame = new Frame(
            new FrameHeader(header.opcode, header.version, header.flags & ~FLAG_CHUNK & ~FLAG_CHUNK_LAST, assembled.length, header.req_id),
            assembled
          );
          this.resolveRead(frame);
        }
      } else {
        const frame = new Frame(header, payload);
        this.resolveRead(frame);
      }
    }
  }

  async readFrame(): Promise<Frame | null> {
    return new Promise((resolve) => {
      if (this.readBuffer.length >= HEADER_LEN) {
        this.processBuffer();
      }
      if (!this.readResolver) {
        this.readResolver = resolve;
      }
    });
  }

  async writeFrame(frame: Frame): Promise<void> {
    return new Promise((resolve) => {
      this.writeQueue.push({ frame, resolver: resolve });
      this.processWriteQueue();
    });
  }

  private processWriteQueue() {
    if (this.writing || this.writeQueue.length === 0) return;
    this.writing = true;

    const { frame, resolver } = this.writeQueue.shift()!;
    const payload = frame.payload;

    if (payload.length <= MAX_PAYLOAD_LEN) {
      // Single frame
      const headerBuf = frame.header.encode();
      this.socket.write(Buffer.concat([headerBuf, payload]), () => {
        this.writing = false;
        resolver();
        this.processWriteQueue();
      });
    } else {
      // Chunked
      const chunkId = this.nextChunkId++;
      let offset = 0;
      let first = true;

      const writeNextChunk = () => {
        if (offset >= payload.length) {
          this.writing = false;
          resolver();
          this.processWriteQueue();
          return;
        }

        const take = Math.min(payload.length - offset, MAX_PAYLOAD_LEN - 4);
        const body = payload.subarray(offset, offset + take);
        const chunkPayload = Buffer.alloc(4 + body.length);
        chunkPayload.writeUInt32BE(chunkId, 0);
        body.copy(chunkPayload, 4);

        let flags = frame.header.flags & ~FLAG_CHUNK & ~FLAG_CHUNK_LAST;
        if (first) flags |= FLAG_CHUNK;
        if (offset + take >= payload.length) flags |= FLAG_CHUNK_LAST;

        const headerBuf = new FrameHeader(
          frame.header.opcode,
          frame.header.version,
          flags,
          chunkPayload.length,
          frame.header.req_id
        ).encode();

        this.socket.write(Buffer.concat([headerBuf, chunkPayload]), () => {
          first = false;
          offset += take;
          writeNextChunk();
        });
      };

      writeNextChunk();
    }
  }

  async flush(): Promise<void> {
    return new Promise((resolve) => {
      this.socket.write(Buffer.alloc(0), resolve);
    });
  }

  close() {
    this.socket.end();
  }
}

export async function connectTcp(host: string, port: number): Promise<Connection> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port }, () => {
      socket.setNoDelay(true);
      resolve(new Connection(socket));
    });
    socket.on('error', reject);
  });
}

export async function connectTls(
  host: string,
  port: number,
  options?: tls.ConnectionOptions
): Promise<Connection> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host, port, ...options }, () => {
      socket.setNoDelay(true);
      resolve(new Connection(socket));
    });
    socket.on('error', reject);
  });
}
