/**
 * OSP Browser SDK
 * WebSocket + Protobuf implementation for browser environments
 */

export { OSPBrowserClient, ClientConfig, OspRecord, Operation } from './client';
export {
  Frame,
  FrameHeader,
  OpCode,
  encodeFrame,
  decodeFrame,
  MAGIC,
  PROTOCOL_VERSION,
  HEADER_LEN,
  MAX_PAYLOAD_LEN,
} from './frame';
export { osp } from './osp_pb';
