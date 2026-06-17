# OSP SDK for Flutter/Dart

Flutter/Dart SDK untuk menghubungkan aplikasi ke server OSP (Owl Sync Protocol).

## Instalasi

```yaml
dependencies:
  owl_osp_sdk:
    path: sdk/flutter
```

## Quick Start

```dart
import 'package:owl_osp_sdk/owl_osp_sdk.dart';

void main() async {
  final client = OspClient(
    serverUrl: '127.0.0.1',
    port: 9420,
    token: 'your-auth-token',
  );

  // Listen events
  client.events.listen((event) {
    if (event is ConnectedEvent) {
      print('Connected: ${event.sessionId}');
    } else if (event is AuthenticatedEvent) {
      print('Authenticated: ${event.deviceId}');
    } else if (event is OperationEvent) {
      print('Op: ${event.operation.collection}/${event.operation.recordId}');
    }
  });

  // Connect
  await client.connect();

  // Set record
  await client.set('users', 'user-123', {
    'name': 'Alice',
    'email': 'alice@example.com',
  });

  // Subscribe
  await client.subscribe('users');

  // Delete
  await client.delete('users', 'user-123');

  // Disconnect
  await client.disconnect();
}
```

## Collection Stream

```dart
// Listen specific collection only
client.collectionStream('users').listen((op) {
  print('${op.kind}: ${op.recordId}');
});
```

## API

### OspClient

**Constructor:**
- `serverUrl`: String
- `port`: int
- `token`: String
- `deviceId`: String? (auto-generate)

**Methods:**
- `connect(): Future<void>`
- `disconnect(): Future<void>`
- `set(collection, recordId, fields): Future<void>`
- `delete(collection, recordId): Future<void>`
- `restore(collection, recordId): Future<void>`
- `subscribe(collection, {withSnapshot}): Future<void>`
- `unsubscribe(subscriptionId): Future<void>`
- `collectionStream(collection): Stream<OperationMsg>`

**Properties:**
- `isConnected: bool`
- `isAuthenticated: bool`
- `deviceId: String`
- `events: Stream<OspEvent>`

### Events

- `ConnectedEvent` - HELLO_ACK received
- `AuthenticatedEvent` - AUTH_OK received
- `AuthFailedEvent` - AUTH_FAILED received
- `DisconnectedEvent` - Connection closed
- `OperationEvent` - Operation received
- `SubscriptionEvent` - SUBSCRIBE_ACK received
- `OpAckEvent` - Operation acknowledged
- `ErrorEvent` - Error occurred

## Features

- ✅ TCP connection
- ✅ Stream-based API
- ✅ Type-safe messages
- ✅ Auto-reconnect support
- ✅ Collection-specific streams

## License

MIT
