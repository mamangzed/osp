import 'dart:convert';
import 'dart:typed_data';

/// OSP wire protocol constants and frame codec.
class FrameConstants {
  static const magic = <int>[79, 87, 76, 49]; // "OWL1"
  static const protocolVersion = 1;
  static const headerLen = 22;
  static const maxPayloadLen = 16 * 1024 * 1024; // 16 MB

  static const flagCompressed = 1 << 0;
  static const flagChunk = 1 << 1;
  static const flagChunkLast = 1 << 2;
}

/// OSP opcodes.
enum OpCode {
  hello(0x01),
  helloAck(0x02),
  auth(0x03),
  authOk(0x04),
  authFailed(0x05),
  subscribe(0x06),
  subscribeAck(0x07),
  unsubscribe(0x08),
  patch(0x09),
  delete(0x0A),
  restore(0x0B),
  sync(0x0C),
  ack(0x0D),
  heartbeat(0x0E),
  error(0x0F),
  presence(0x10),
  ping(0x11),
  pong(0x12);

  final int value;
  const OpCode(this.value);

  static OpCode? fromValue(int value) {
    for (final op in values) {
      if (op.value == value) return op;
    }
    return null;
  }
}

/// OSP frame header (22 bytes).
class FrameHeader {
  final OpCode opcode;
  final int version;
  final int flags;
  final int length;
  final int reqId;

  FrameHeader({
    required this.opcode,
    this.version = FrameConstants.protocolVersion,
    this.flags = 0,
    required this.length,
    this.reqId = 0,
  });

  /// Encode header to 22 bytes, big-endian.
  Uint8List encode() {
    final data = ByteData(FrameConstants.headerLen);
    int offset = 0;

    // Magic (4 bytes)
    for (final b in FrameConstants.magic) {
      data.setUint8(offset++, b);
    }

    // Version (2 bytes)
    data.setUint16(offset, version, Endian.big);
    offset += 2;

    // Opcode (2 bytes)
    data.setUint16(offset, opcode.value, Endian.big);
    offset += 2;

    // Flags (2 bytes)
    data.setUint16(offset, flags, Endian.big);
    offset += 2;

    // Length (4 bytes)
    data.setUint32(offset, length, Endian.big);
    offset += 4;

    // Request ID (8 bytes)
    data.setInt64(offset, reqId, Endian.big);

    return data.buffer.asUint8List();
  }

  /// Decode header from bytes. Returns null if not enough data.
  static FrameHeader? decode(Uint8List buffer) {
    if (buffer.length < FrameConstants.headerLen) return null;

    final data = ByteData.sublistView(buffer);
    int offset = 0;

    // Check magic
    for (int i = 0; i < 4; i++) {
      if (data.getUint8(offset + i) != FrameConstants.magic[i]) {
        throw FormatException('Invalid magic bytes');
      }
    }
    offset += 4;

    // Version
    final version = data.getUint16(offset, Endian.big);
    offset += 2;
    if (version != FrameConstants.protocolVersion) {
      throw FormatException('Unsupported protocol version: $version');
    }

    // Opcode
    final opcodeRaw = data.getUint16(offset, Endian.big);
    offset += 2;
    final opcode = OpCode.fromValue(opcodeRaw);
    if (opcode == null) {
      throw FormatException('Unknown opcode: 0x${opcodeRaw.toRadixString(16)}');
    }

    // Flags
    final flags = data.getUint16(offset, Endian.big);
    offset += 2;

    // Length
    final length = data.getUint32(offset, Endian.big);
    offset += 4;
    if (length > FrameConstants.maxPayloadLen) {
      throw FormatException('Payload too large: $length');
    }

    // Request ID
    final reqId = data.getInt64(offset, Endian.big);

    return FrameHeader(
      opcode: opcode,
      version: version,
      flags: flags,
      length: length,
      reqId: reqId,
    );
  }
}

/// A complete OSP frame: header + payload.
class Frame {
  final FrameHeader header;
  final Uint8List payload;

  Frame({required this.header, required this.payload});

  Frame.create({
    required OpCode opcode,
    int reqId = 0,
    required this.payload,
    int flags = 0,
  }) : header = FrameHeader(
         opcode: opcode,
         length: payload.length,
         reqId: reqId,
         flags: flags,
       );

  /// Encode entire frame to bytes.
  Uint8List encode() {
    final headerBytes = header.encode();
    final result = Uint8List(headerBytes.length + payload.length);
    result.setAll(0, headerBytes);
    result.setAll(headerBytes.length, payload);
    return result;
  }

  /// Decode frame from bytes. Returns null if not enough data.
  static Frame? decode(Uint8List buffer) {
    final header = FrameHeader.decode(buffer);
    if (header == null) return null;

    final totalLen = FrameConstants.headerLen + header.length;
    if (buffer.length < totalLen) return null;

    final payload = buffer.sublist(FrameConstants.headerLen, totalLen);
    return Frame(header: header, payload: payload);
  }
}
