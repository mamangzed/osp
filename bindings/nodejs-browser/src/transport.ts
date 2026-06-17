/**
 * OSP Transport Layer - WebSocket connection with chunking (Browser SDK)
 */

import { Frame, FrameHeader, HEADER_LEN, MAX_PAYLOAD_LEN, FLAG_CHUNK, FLAG_CHUNK_LAST } from './protocol';

interface ChunkState {
  id: number;
  accumulated: Uint8Array[];
  opcode: number;
  req_id: bigint;
  flags: number;
}

export class Connection {
  private ws: WebSocket;
  private readBuffer: Uint8Array = new Uint8Array(0);
  private readResolver: ((frame: Frame | null) => void) | null = null;
  private writeQueue: { frame: Frame; resolver: () => void }[] = [];
  private writing = false;
  private chunkState: ChunkState | null = null;
  private nextChunkId = 0;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.ws.binaryType = 'arraybuffer';
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = () => this.resolveRead(null);
    this.ws.onerror = () => this.resolveRead(null);
  }

  private resolveRead(frame: Frame | null) {
    if (this.readResolver) {
      const resolver = this.readResolver;
      this.readResolver = null;
      resolver(frame);
    }
  }

  private handleMessage(event: MessageEvent) {
    const data = new Uint8Array(event.data);
    const newBuffer = new Uint8Array(this.readBuffer.length + data.length);
    newBuffer.set(this.readBuffer);
    newBuffer.set(data, this.readBuffer.length);
    this.readBuffer = newBuffer;
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
        const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
        const chunkId = view.getUint32(0, false);
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
          const totalLength = this.chunkState.accumulated.reduce((sum, arr) => sum + arr.length, 0);
          const assembled = new Uint8Array(totalLength);
          let offset = 0;
          for (const arr of this.chunkState.accumulated) {
            assembled.set(arr, offset);
            offset += arr.length;
          }
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
      const finalBuf = new Uint8Array(headerBuf.length + payload.length);
      finalBuf.set(headerBuf);
      finalBuf.set(payload, headerBuf.length);

      this.ws.send(finalBuf);
      this.writing = false;
      resolver();
      this.processWriteQueue();
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

        const chunkPayload = new Uint8Array(4 + body.length);
        const view = new DataView(chunkPayload.buffer);
        view.setUint32(0, chunkId, false);
        chunkPayload.set(body, 4);

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

        const finalBuf = new Uint8Array(headerBuf.length + chunkPayload.length);
        finalBuf.set(headerBuf);
        finalBuf.set(chunkPayload, headerBuf.length);

        this.ws.send(finalBuf);
        first = false;
        offset += take;
        writeNextChunk();
      };

      writeNextChunk();
    }
  }

  close() {
    this.ws.close();
  }
}

export async function connectWs(url: string): Promise<Connection> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      resolve(new Connection(ws));
    };

    ws.onerror = (error) => {
      reject(new Error(`WebSocket connection failed: ${error}`));
    };
  });
}
