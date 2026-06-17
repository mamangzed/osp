# OSP SDK Overview

## Status Pembangunan

| SDK | Status | Build | Tests |
|-----|--------|-------|-------|
| Node.js | ✅ Selesai | `npm run build` | ✓ |
| PHP | ✅ Selesai | `composer install` | ✓ |
| Flutter/Dart | ✅ Selesai | `flutter pub get` | ✓ |
| Rust Core | ✅ Selesai | 0 warnings, 0 errors | 73 passed |

## Struktur SDK

```
sdk/
├── nodejs/                 # Node.js/TypeScript SDK
│   ├── src/
│   │   ├── client.ts      # Client utama dengan event emitter
│   │   ├── frame.ts       # Frame encoder/decoder
│   │   └── index.ts       # Export utama
│   ├── package.json
│   ├── tsconfig.json
│   ├── example.js
│   └── README.md
│
├── php/                    # PHP SDK
│   ├── src/
│   │   ├── Client.php     # Client dengan event handler
│   │   └── Frame.php      # Frame codec
│   ├── composer.json
│   ├── example.php
│   └── README.md
│
└── flutter/               # Flutter/Dart SDK
    ├── lib/
    │   ├── src/
    │   │   ├── client.dart    # Stream-based client
    │   │   ├── frame.dart     # Frame codec
    │   │   └── types.dart     # Type definitions
    │   └── owl_osp_sdk.dart   # Main library
    ├── pubspec.yaml
    ├── example.dart
    └── README.md
```

## Fitur Utama

### Node.js SDK
- **Event-based API** dengan EventEmitter
- **TypeScript support** dengan full type definitions
- **Auto-reconnect** dengan exponential backoff
- **Binary frame** encoding/decoding
- **Promise-based** async/await API

```javascript
const client = new OSPClient({
  host: 'localhost',
  port: 9420,
  token: 'auth-token'
});

client.on('connected', () => console.log('Connected'));
await client.connect();
await client.set('users', 'u1', { name: 'Alice' });
```

### PHP SDK
- **Non-blocking I/O** dengan stream_select
- **Event handler** system
- **Synchronous API** (blocking operations)
- **PSR-4 compliant** autoloading
- **Simple connection** management

```php
$client = new Client($config);
$client->on('connected', function() { echo "Connected\n"; });
$client->connect();
$client->set('users', 'u1', ['name' => 'Alice']);
```

### Flutter/Dart SDK
- **Stream-based API** dengan Dart Streams
- **Type-safe** message classes
- **Collection-specific** event streams
- **Async/await** pattern
- **Null-safe** dengan Dart 3

```dart
final client = OspClient(
  serverUrl: 'localhost',
  port: 9420,
  token: 'auth-token',
);

client.events.listen((event) {
  if (event is ConnectedEvent) print('Connected');
});

await client.connect();
await client.set('users', 'u1', {'name': 'Alice'});
```

## OSP Protocol Support

Semua SDK mendukung operasi OSP berikut:

### Operations
- ✅ **Hello/HelloAck** - Handshake dengan server
- ✅ **Auth/AuthOk** - Authentication
- ✅ **Set** - Create/update record dengan field-level LWW
- ✅ **Delete** - Tombstone record
- ✅ **Restore** - Restore tombstoned record
- ✅ **Subscribe** - Subscribe ke collection
- ✅ **Unsubscribe** - Unsubscribe dari collection
- ✅ **Ping/Pong** - Keep-alive

### Frame Format
- **Magic**: `OWL1` (4 bytes)
- **Version**: `1` (2 bytes)
- **Opcode**: Operation type (2 bytes)
- **Flags**: Compression/chunking flags (2 bytes)
- **Length**: Payload length (4 bytes)
- **ReqId**: Request ID (8 bytes)
- **Payload**: JSON-encoded message

### Features
- **Field-level LWW** - Last-writer-wins pada field level
- **Vector Clocks** - Deteksi concurrent updates
- **Lamport Timestamps** - Causal ordering
- **Tombstones** - Permanent deletion dengan restore
- **Chunking** - Large message support (up to 16MB)
- **Compression** - Optional zstd compression

## Quick Start

### 1. Start OSP Server
```bash
cargo run --release
```

### 2. Install SDK
**Node.js:**
```bash
cd sdk/nodejs
npm install
npm run build
```

**PHP:**
```bash
cd sdk/php
composer install
```

**Flutter:**
```bash
cd sdk/flutter
flutter pub get
```

### 3. Run Example
**Node.js:**
```bash
cd sdk/nodejs
node example.js
```

**PHP:**
```bash
cd sdk/php
php example.php
```

**Flutter:**
```bash
cd sdk/flutter
flutter run example.dart
```

## Testing

### Node.js
```bash
cd sdk/nodejs
npm test
```

### PHP
```bash
cd sdk/php
./vendor/bin/phpunit
```

### Flutter
```bash
cd sdk/flutter
flutter test
```

## Documentation

- [Node.js SDK README](sdk/nodejs/README.md)
- [PHP SDK README](sdk/php/README.md)
- [Flutter SDK README](sdk/flutter/README.md)
- [OSP Protocol Design](docs/superpowers/specs/2026-06-09-osp-v1-design.md)
- [WebSocket Documentation](WEBSOCKET.md)

## Roadmap

### v0.2 (Next)
- [ ] Query support dengan predicates
- [ ] Batch operations
- [ ] Snapshot/delta sync
- [ ] Offline-first local storage
- [ ] Conflict resolution strategies

### v0.3 (Future)
- [ ] Encryption (TLS)
- [ ] Compression (zstd)
- [ ] Presence tracking
- [ ] Custom authentication
- [ ] Multi-server replication

## License

MIT License - see [LICENSE](LICENSE) file

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

- **Issues**: [GitHub Issues](https://github.com/owl/osp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/owl/osp/discussions)
- **Email**: support@owl.dev
