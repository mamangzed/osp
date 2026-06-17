import 'dart:async';
import 'dart:typed_data';

import 'package:uuid/uuid.dart';

import 'frame.dart';
import 'types.dart';
import 'generated/osp/v1/common.pb.dart' as pb;
import 'generated/osp/v1/auth.pb.dart' as pb;
import 'generated/osp/v1/sync.pb.dart' as pb;
import 'generated/osp/v1/frame.pb.dart' as pb;

/// OSP Client for Flutter/Dart.
/// Uses protobuf for binary serialization.
class OspClient {
  Socket? _socket;
  Uint8List _buffer = Uint8List(0);
  int _requestId = 0;
  final String _deviceId;
  final String _serverUrl;
  final int _port;
  final String _token;

  bool _connected = false;
  bool _authenticated = false;

  final StreamController<OspEvent> _eventController = StreamController.broadcast();
  final Map<String, StreamController<OperationMsg>> _collectionControllers = {};

  /// Stream of all events from the server.
  Stream<OspEvent> get events => _eventController.stream;

  /// Whether the client is connected and authenticated.
  bool get isConnected => _connected;
  bool get isAuthenticated => _authenticated;

  /// Device ID for this client instance.
  String get deviceId => _deviceId;

  OspClient({
    required String serverUrl,
    required int port,
    required String token,
    String? deviceId,
  })  : _serverUrl = serverUrl,
        _port = port,
        _token = token,
        _deviceId = deviceId ?? const Uuid().v4();

  /// Connect to the OSP server.
  Future<void> connect() async {
    if (_connected) {
      throw StateError('Already connected');
    }

    _socket = await Socket.connect(_serverUrl, _port);
    _connected = true;

    _socket!.listen(
      _onData,
      onError: _onError,
      onDone: _onDone,
      cancelOnError: false,
    );

    // Send HELLO
    await _sendHello();
  }

  /// Disconnect from the server.
  Future<void> disconnect() async {
    _connected = false;
    _authenticated = false;
    await _socket?.close();
    _socket = null;
    _eventController.close();
    for (final controller in _collectionControllers.values) {
      controller.close();
    }
    _collectionControllers.clear();
  }

  Future<void> _sendHello() async {
    final hello = pb.Hello()
      ..protocolVersion = FrameConstants.protocolVersion
      ..sdkVersion = '0.1.0'
      ..deviceId = _deviceId
      ..devicePlatform = 'flutter'
      ..capabilities.addAll([
        pb.Capability.CAPABILITY_COMPRESSION_ZSTD,
        pb.Capability.CAPABILITY_CHUNKING,
        pb.Capability.CAPABILITY_RESUME,
      ]);

    final envelope = pb.Envelope()..hello = hello;
    await _sendProtobuf(OpCode.hello, envelope);
  }

  Future<void> _sendAuth() async {
    final auth = pb.Auth()..token = _token;
    final envelope = pb.Envelope()..auth = auth;
    await _sendProtobuf(OpCode.auth, envelope);
  }

  /// Set a field on a record.
  Future<void> set(
    String collection,
    String recordId,
    Map<String, dynamic> fields,
  ) async {
    if (!_authenticated) {
      throw StateError('Not authenticated');
    }

    final fieldChanges = fields.entries.map((e) {
      return pb.FieldChange()
        ..fieldName = e.key
        ..newValue = _toProtoValue(e.value)
        ..lamport = _currentTimestamp()
        ..writerDeviceId = _deviceId;
    }).toList();

    final op = pb.Operation()
      ..opId = const Uuid().v4()
      ..deviceId = _deviceId
      ..lamport = _currentTimestamp()
      ..collection = collection
      ..recordId = recordId
      ..kind = pb.OpKind.OP_KIND_UPDATE
      ..fieldChanges.addAll(fieldChanges)
      ..baseClock = pb.VClock()
      ..timestampMs = _currentTimestamp();

    final envelope = pb.Envelope()..op = op;
    await _sendProtobuf(OpCode.patch, envelope);
  }

  /// Delete a record (tombstone).
  Future<void> delete(String collection, String recordId) async {
    if (!_authenticated) {
      throw StateError('Not authenticated');
    }

    final op = pb.Operation()
      ..opId = const Uuid().v4()
      ..deviceId = _deviceId
      ..lamport = _currentTimestamp()
      ..collection = collection
      ..recordId = recordId
      ..kind = pb.OpKind.OP_KIND_DELETE
      ..fieldChanges.addAll([])
      ..baseClock = pb.VClock()
      ..timestampMs = _currentTimestamp();

    final envelope = pb.Envelope()..op = op;
    await _sendProtobuf(OpCode.delete, envelope);
  }

  /// Restore a tombstoned record.
  Future<void> restore(String collection, String recordId) async {
    if (!_authenticated) {
      throw StateError('Not authenticated');
    }

    final op = pb.Operation()
      ..opId = const Uuid().v4()
      ..deviceId = _deviceId
      ..lamport = _currentTimestamp()
      ..collection = collection
      ..recordId = recordId
      ..kind = pb.OpKind.OP_KIND_RESTORE
      ..fieldChanges.addAll([])
      ..baseClock = pb.VClock()
      ..timestampMs = _currentTimestamp();

    final envelope = pb.Envelope()..op = op;
    await _sendProtobuf(OpCode.restore, envelope);
  }

  /// Subscribe to a collection.
  Future<void> subscribe(String collection, {bool withSnapshot = true}) async {
    if (!_authenticated) {
      throw StateError('Not authenticated');
    }

    final sub = pb.Subscribe()
      ..subscriptionId = const Uuid().v4()
      ..collection = collection
      ..withSnapshot = withSnapshot;

    final envelope = pb.Envelope()..subscribe = sub;
    await _sendProtobuf(OpCode.subscribe, envelope);
  }

  /// Unsubscribe from a collection.
  Future<void> unsubscribe(String subscriptionId) async {
    if (!_authenticated) {
      throw StateError('Not authenticated');
    }

    final unsub = pb.Unsubscribe()..subscriptionId = subscriptionId;
    final envelope = pb.Envelope()..unsubscribe = unsub;
    await _sendProtobuf(OpCode.unsubscribe, envelope);
  }

  /// Get a stream of operations for a specific collection.
  Stream<OperationMsg> collectionStream(String collection) {
    if (!_collectionControllers.containsKey(collection)) {
      _collectionControllers[collection] = StreamController<OperationMsg>.broadcast();
    }
    return _collectionControllers[collection]!.stream;
  }

  Future<void> _sendProtobuf(OpCode opcode, pb.Envelope envelope) async {
    final payload = envelope.writeToBuffer();
    final frame = Frame.create(
      opcode: opcode,
      reqId: _requestId++,
      payload: payload,
    );
    _socket!.add(frame.encode());
  }

  void _onData(Uint8List data) {
    _buffer = Uint8List.fromList([..._buffer, ...data]);

    while (_buffer.length >= FrameConstants.headerLen) {
      final frame = Frame.decode(_buffer);
      if (frame == null) break;

      _buffer = _buffer.sublist(FrameConstants.headerLen + frame.header.length);
      _handleFrame(frame);
    }
  }

  void _handleFrame(Frame frame) {
    try {
      final envelope = pb.Envelope.fromBuffer(frame.payload);

      switch (frame.header.opcode) {
        case OpCode.helloAck:
          if (envelope.hasHelloAck()) {
            final helloAck = envelope.helloAck;
            _eventController.add(ConnectedEvent(
              protocolVersion: helloAck.protocolVersion,
              serverVersion: helloAck.serverVersion,
              sessionId: helloAck.sessionId,
            ));
            _sendAuth();
          }
          break;

        case OpCode.authOk:
          if (envelope.hasAuthOk()) {
            _authenticated = true;
            final authOk = envelope.authOk;
            _eventController.add(AuthenticatedEvent(
              deviceId: authOk.deviceId,
              collectionScopes: authOk.collectionScopes,
            ));
          }
          break;

        case OpCode.authFailed:
          if (envelope.hasAuthFailed()) {
            final authFailed = envelope.authFailed;
            _eventController.add(AuthFailedEvent(
              code: authFailed.error?.code ?? 0,
              message: authFailed.error?.message ?? 'Authentication failed',
            ));
            disconnect();
          }
          break;

        case OpCode.patch:
        case OpCode.delete:
        case OpCode.restore:
          if (envelope.hasOp()) {
            final op = _operationFromProto(envelope.op);
            _eventController.add(OperationEvent(operation: op));

            // Route to collection-specific stream
            if (_collectionControllers.containsKey(op.collection)) {
              _collectionControllers[op.collection]!.add(op);
            }
          }
          break;

        case OpCode.subscribeAck:
          if (envelope.hasSubscribeAck()) {
            final ack = envelope.subscribeAck;
            _eventController.add(SubscriptionEvent(
              subscriptionId: ack.subscriptionId,
              accepted: ack.accepted,
              snapshotRevision: ack.snapshotRevision,
            ));
          }
          break;

        case OpCode.ack:
          if (envelope.hasOpAck()) {
            final ack = envelope.opAck;
            _eventController.add(OpAckEvent(
              opId: ack.opId,
              accepted: ack.accepted,
              revision: ack.revision,
            ));
          }
          break;

        case OpCode.ping:
          _sendProtobuf(OpCode.pong, pb.Envelope());
          break;

        case OpCode.error:
          if (envelope.hasError()) {
            final error = envelope.error;
            _eventController.add(ErrorEvent(
              code: error.code,
              message: error.message,
              detail: error.detail,
            ));
          }
          break;

        default:
          _eventController.add(UnknownEvent(opcode: frame.header.opcode));
      }
    } catch (e) {
      _eventController.add(ErrorEvent(code: -1, message: e.toString()));
    }
  }

  void _onError(error) {
    _eventController.add(ErrorEvent(code: -1, message: error.toString()));
  }

  void _onDone() {
    _connected = false;
    _authenticated = false;
    _eventController.add(DisconnectedEvent());
  }

  pb.Value _toProtoValue(dynamic value) {
    if (value == null) {
      return pb.Value()..nullValue = true;
    }
    if (value is bool) {
      return pb.Value()..boolValue = value;
    }
    if (value is int) {
      return pb.Value()..intValue = value;
    }
    if (value is double) {
      return pb.Value()..doubleValue = value;
    }
    if (value is String) {
      return pb.Value()..stringValue = value;
    }
    if (value is List<int>) {
      return pb.Value()..bytesValue = value;
    }
    if (value is List) {
      return pb.Value()
        ..arrayValue = (pb.ValueArray()
          ..items.addAll(value.map((v) => _toProtoValue(v))));
    }
    if (value is Map<String, dynamic>) {
      return pb.Value()
        ..objectValue = (pb.ValueMap()
          ..entries.addAll(value.map((k, v) => MapEntry(k, _toProtoValue(v)))));
    }
    return pb.Value()..nullValue = true;
  }

  OperationMsg _operationFromProto(pb.Operation op) {
    return OperationMsg(
      opId: op.opId,
      deviceId: op.deviceId,
      lamport: op.lamport,
      collection: op.collection,
      recordId: op.recordId,
      kind: _opKindFromProto(op.kind),
      fieldChanges: op.fieldChanges.map((fc) {
        return FieldChange(
          fieldName: fc.fieldName,
          newValue: _valueFromProto(fc.newValue),
          lamport: fc.lamport,
          writerDeviceId: fc.writerDeviceId,
        );
      }).toList(),
      timestampMs: op.timestampMs,
    );
  }

  OpKind _opKindFromProto(pb.OpKind kind) {
    switch (kind) {
      case pb.OpKind.OP_KIND_INSERT:
        return OpKind.insert;
      case pb.OpKind.OP_KIND_UPDATE:
        return OpKind.update;
      case pb.OpKind.OP_KIND_DELETE:
        return OpKind.deleteOp;
      case pb.OpKind.OP_KIND_RESTORE:
        return OpKind.restore;
      default:
        return OpKind.unspecified;
    }
  }

  dynamic _valueFromProto(pb.Value value) {
    if (value.hasNullValue()) return null;
    if (value.hasBoolValue()) return value.boolValue;
    if (value.hasIntValue()) return value.intValue;
    if (value.hasDoubleValue()) return value.doubleValue;
    if (value.hasStringValue()) return value.stringValue;
    if (value.hasBytesValue()) return value.bytesValue;
    if (value.hasArrayValue()) {
      return value.arrayValue.items.map((v) => _valueFromProto(v)).toList();
    }
    if (value.hasObjectValue()) {
      return value.objectValue.entries.map((k, v) => MapEntry(k, _valueFromProto(v)));
    }
    return null;
  }

  int _currentTimestamp() {
    return DateTime.now().millisecondsSinceEpoch;
  }
}

/// Base class for OSP events.
abstract class OspEvent {}

/// Emitted when connected to the server (HELLO_ACK received).
class ConnectedEvent extends OspEvent {
  final int protocolVersion;
  final String serverVersion;
  final String sessionId;

  ConnectedEvent({
    required this.protocolVersion,
    required this.serverVersion,
    required this.sessionId,
  });
}

/// Emitted when authentication succeeds (AUTH_OK received).
class AuthenticatedEvent extends OspEvent {
  final String deviceId;
  final List<String> collectionScopes;

  AuthenticatedEvent({
    required this.deviceId,
    required this.collectionScopes,
  });
}

/// Emitted when authentication fails (AUTH_FAILED received).
class AuthFailedEvent extends OspEvent {
  final int code;
  final String message;

  AuthFailedEvent({
    required this.code,
    required this.message,
  });
}

/// Emitted when disconnected from the server.
class DisconnectedEvent extends OspEvent {}

/// Emitted when an operation is received (PATCH/DELETE/RESTORE).
class OperationEvent extends OspEvent {
  final OperationMsg operation;

  OperationEvent({required this.operation});
}

/// Emitted when a subscription is acknowledged (SUBSCRIBE_ACK received).
class SubscriptionEvent extends OspEvent {
  final String subscriptionId;
  final bool accepted;
  final int snapshotRevision;

  SubscriptionEvent({
    required this.subscriptionId,
    required this.accepted,
    required this.snapshotRevision,
  });
}

/// Emitted when an operation is acknowledged (ACK received).
class OpAckEvent extends OspEvent {
  final String opId;
  final bool accepted;
  final int revision;

  OpAckEvent({
    required this.opId,
    required this.accepted,
    required this.revision,
  });
}

/// Emitted when an error occurs.
class ErrorEvent extends OspEvent {
  final int code;
  final String message;
  final String detail;

  ErrorEvent({
    required this.code,
    required this.message,
    this.detail = '',
  });
}

/// Emitted when an unknown opcode is received.
class UnknownEvent extends OspEvent {
  final OpCode opcode;

  UnknownEvent({required this.opcode});
}
