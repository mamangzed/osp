/**
 * OSP SDK for Node.js
 */

export { OSPClient, ClientConfig, OspRecord, Operation } from './client';
export { osp } from './osp_pb';
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
