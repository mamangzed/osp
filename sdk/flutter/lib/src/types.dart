import 'dart:convert';

/// Field change in an operation.
class FieldChange {
  final String fieldName;
  final dynamic newValue;
  final int lamport;
  final String writerDeviceId;

  FieldChange({
    required this.fieldName,
    this.newValue,
    required this.lamport,
    required this.writerDeviceId,
  });

  Map<String, dynamic> toJson() => {
    'field_name': fieldName,
    if (newValue != null) 'new_value': newValue,
    'lamport': lamport,
    'writer_device_id': writerDeviceId,
  };

  factory FieldChange.fromJson(Map<String, dynamic> json) => FieldChange(
    fieldName: json['field_name'] as String,
    newValue: json['new_value'],
    lamport: json['lamport'] as int,
    writerDeviceId: json['writer_device_id'] as String,
  );
}

/// Operation types.
enum OpKind { insert, update, deleteOp, restore, unspecified }

/// An OSP operation message.
class OperationMsg {
  final String opId;
  final String deviceId;
  final int lamport;
  final String collection;
  final String recordId;
  final OpKind kind;
  final List<FieldChange> fieldChanges;
  final int timestampMs;

  OperationMsg({
    required this.opId,
    required this.deviceId,
    required this.lamport,
    required this.collection,
    required this.recordId,
    required this.kind,
    required this.fieldChanges,
    required this.timestampMs,
  });

  Map<String, dynamic> toJson() => {
    'op_id': opId,
    'device_id': deviceId,
    'lamport': lamport,
    'collection': collection,
    'record_id': recordId,
    'kind': _kindToString(kind),
    'field_changes': fieldChanges.map((f) => f.toJson()).toList(),
    'timestamp_ms': timestampMs,
  };

  factory OperationMsg.fromJson(Map<String, dynamic> json) => OperationMsg(
    opId: json['op_id'] as String,
    deviceId: json['device_id'] as String,
    lamport: json['lamport'] as int,
    collection: json['collection'] as String,
    recordId: json['record_id'] as String,
    kind: _kindFromString(json['kind'] as String),
    fieldChanges: (json['field_changes'] as List<dynamic>?)
            ?.map((e) => FieldChange.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [],
    timestampMs: json['timestamp_ms'] as int,
  );

  static String _kindToString(OpKind kind) {
    switch (kind) {
      case OpKind.insert: return 'insert';
      case OpKind.update: return 'update';
      case OpKind.deleteOp: return 'delete';
      case OpKind.restore: return 'restore';
      case OpKind.unspecified: return 'unspecified';
    }
  }

  static OpKind _kindFromString(String s) {
    switch (s) {
      case 'insert': return OpKind.insert;
      case 'update': return OpKind.update;
      case 'delete': return OpKind.deleteOp;
      case 'restore': return OpKind.restore;
      default: return OpKind.unspecified;
    }
  }
}

/// A record in OSP storage.
class RecordMsg {
  final String collection;
  final String recordId;
  final int revision;
  final bool tombstone;
  final Map<String, dynamic> fields;
  final Map<String, FieldMetaMsg> fieldMeta;
  final int updatedAtMs;

  RecordMsg({
    required this.collection,
    required this.recordId,
    required this.revision,
    this.tombstone = false,
    required this.fields,
    this.fieldMeta = const {},
    required this.updatedAtMs,
  });

  Map<String, dynamic> toJson() => {
    'collection': collection,
    'record_id': recordId,
    'revision': revision,
    'tombstone': tombstone,
    'fields': fields,
    'field_meta': fieldMeta.map((k, v) => MapEntry(k, v.toJson())),
    'updated_at_ms': updatedAtMs,
  };

  factory RecordMsg.fromJson(Map<String, dynamic> json) => RecordMsg(
    collection: json['collection'] as String,
    recordId: json['record_id'] as String,
    revision: json['revision'] as int,
    tombstone: json['tombstone'] as bool,
    fields: Map<String, dynamic>.from(json['fields'] as Map),
    fieldMeta: (json['field_meta'] as Map<String, dynamic>?)
            ?.map((k, v) => MapEntry(k, FieldMetaMsg.fromJson(v as Map<String, dynamic>))) ??
        {},
    updatedAtMs: json['updated_at_ms'] as int,
  );
}

/// Field metadata.
class FieldMetaMsg {
  final int lamport;
  final String writerDeviceId;

  FieldMetaMsg({required this.lamport, required this.writerDeviceId});

  Map<String, dynamic> toJson() => {
    'lamport': lamport,
    'writer_device_id': writerDeviceId,
  };

  factory FieldMetaMsg.fromJson(Map<String, dynamic> json) => FieldMetaMsg(
    lamport: json['lamport'] as int,
    writerDeviceId: json['writer_device_id'] as String,
  );
}

/// Hello message.
class HelloMsg {
  final int protocolVersion;
  final String sdkVersion;
  final String deviceId;
  final String devicePlatform;
  final List<String> capabilities;

  HelloMsg({
    required this.protocolVersion,
    required this.sdkVersion,
    required this.deviceId,
    required this.devicePlatform,
    this.capabilities = const [],
  });

  Map<String, dynamic> toJson() => {
    'protocol_version': protocolVersion,
    'sdk_version': sdkVersion,
    'device_id': deviceId,
    'device_platform': devicePlatform,
    'capabilities': capabilities,
  };

  factory HelloMsg.fromJson(Map<String, dynamic> json) => HelloMsg(
    protocolVersion: json['protocol_version'] as int,
    sdkVersion: json['sdk_version'] as String,
    deviceId: json['device_id'] as String,
    devicePlatform: json['device_platform'] as String,
    capabilities: (json['capabilities'] as List<dynamic>?)?.cast<String>() ?? [],
  );
}

/// HelloAck message.
class HelloAckMsg {
  final int protocolVersion;
  final String serverVersion;
  final String sessionId;
  final int heartbeatIntervalMs;
  final List<String> selectedCapabilities;
  final int snapshotWindow;

  HelloAckMsg({
    required this.protocolVersion,
    required this.serverVersion,
    required this.sessionId,
    required this.heartbeatIntervalMs,
    this.selectedCapabilities = const [],
    required this.snapshotWindow,
  });

  factory HelloAckMsg.fromJson(Map<String, dynamic> json) => HelloAckMsg(
    protocolVersion: json['protocol_version'] as int,
    serverVersion: json['server_version'] as String,
    sessionId: json['session_id'] as String,
    heartbeatIntervalMs: json['heartbeat_interval_ms'] as int,
    selectedCapabilities:
        (json['selected_capabilities'] as List<dynamic>?)?.cast<String>() ?? [],
    snapshotWindow: json['snapshot_window'] as int,
  );
}

/// Auth message.
class AuthMsg {
  final String token;
  AuthMsg({required this.token});
  Map<String, dynamic> toJson() => {'token': token};
}

/// AuthOk message.
class AuthOkMsg {
  final String deviceId;
  final List<String> collectionScopes;

  AuthOkMsg({required this.deviceId, this.collectionScopes = const []});

  factory AuthOkMsg.fromJson(Map<String, dynamic> json) => AuthOkMsg(
    deviceId: json['device_id'] as String,
    collectionScopes:
        (json['collection_scopes'] as List<dynamic>?)?.cast<String>() ?? [],
  );
}

/// AuthFailed message.
class AuthFailedMsg {
  final int code;
  final String message;
  final String detail;

  AuthFailedMsg({
    required this.code,
    required this.message,
    this.detail = '',
  });

  factory AuthFailedMsg.fromJson(Map<String, dynamic> json) => AuthFailedMsg(
    code: json['code'] as int,
    message: json['message'] as String,
    detail: json['detail'] as String? ?? '',
  );
}

/// Subscribe message.
class SubscribeMsg {
  final String subscriptionId;
  final String collection;
  final bool withSnapshot;

  SubscribeMsg({
    required this.subscriptionId,
    required this.collection,
    this.withSnapshot = true,
  });

  Map<String, dynamic> toJson() => {
    'subscription_id': subscriptionId,
    'collection': collection,
    'with_snapshot': withSnapshot,
  };
}

/// SubscribeAck message.
class SubscribeAckMsg {
  final String subscriptionId;
  final bool accepted;
  final int snapshotRevision;
  final ErrorMsg? error;

  SubscribeAckMsg({
    required this.subscriptionId,
    required this.accepted,
    this.snapshotRevision = 0,
    this.error,
  });

  factory SubscribeAckMsg.fromJson(Map<String, dynamic> json) => SubscribeAckMsg(
    subscriptionId: json['subscription_id'] as String,
    accepted: json['accepted'] as bool,
    snapshotRevision: json['snapshot_revision'] as int,
    error: json['error'] != null ? ErrorMsg.fromJson(json['error']) : null,
  );
}

/// OpAck message.
class OpAckMsg {
  final String opId;
  final bool accepted;
  final int revision;
  final ErrorMsg? error;

  OpAckMsg({
    required this.opId,
    required this.accepted,
    this.revision = 0,
    this.error,
  });

  factory OpAckMsg.fromJson(Map<String, dynamic> json) => OpAckMsg(
    opId: json['op_id'] as String,
    accepted: json['accepted'] as bool,
    revision: json['revision'] as int,
    error: json['error'] != null ? ErrorMsg.fromJson(json['error']) : null,
  );
}

/// Error message.
class ErrorMsg {
  final int code;
  final String message;
  final String detail;

  ErrorMsg({
    required this.code,
    required this.message,
    this.detail = '',
  });

  factory ErrorMsg.fromJson(Map<String, dynamic> json) => ErrorMsg(
    code: json['code'] as int,
    message: json['message'] as String,
    detail: json['detail'] as String? ?? '',
  );
}
