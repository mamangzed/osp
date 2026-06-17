# OSP SDK

Multi-language SDK for OSP (Owl Sync Protocol) - a distributed synchronization protocol.

## 📦 Available SDKs

| Language | Package | Status | Protobuf Support |
|----------|---------|--------|------------------|
| **Node.js** | `@owl/osp-sdk` | ✅ Ready | ✅ protobufjs |
| **PHP** | `owl/osp-sdk` | ✅ Ready | ✅ google/protobuf |
| **Flutter/Dart** | `owl_osp_sdk` | ✅ Ready | ✅ protobuf |

## 🚀 Quick Start

### Node.js

```bash
cd sdk/nodejs
npm install
npm run generate:proto
npm run build
```

```javascript
const { Client } = require('@owl/osp-sdk');

const client = new Client({
  host: 'localhost',
  port: 8080,
  token: 'your-auth-token'
});

await client.connect();
await client.subscribe('users');
```

### PHP

```bash
cd sdk/php
composer install
composer generate-proto
```

```php
use OWL\OSP\Client;

$client = new Client([
    'host' => 'localhost',
    'port' => 8080,
    'token' => 'your-auth-token'
]);

$client->connect();
$client->subscribe('users');
```

### Flutter/Dart

```bash
cd sdk/flutter
flutter pub get
./scripts/generate-proto.sh
```

```dart
import 'package:owl_osp_sdk/owl_osp_sdk.dart';

final client = Client(
  host: 'localhost',
  port: 8080,
  token: 'your-auth-token',
);

await client.connect();
await client.subscribe('users');
```

## 🔧 Protocol Buffers

Semua SDK menggunakan **Protocol Buffers** untuk serialisasi data, sesuai dengan spesifikasi OSP.

### Why Protobuf?

- **Binary format**: Lebih efisien daripada JSON (50-70% smaller)
- **Type safety**: Schema-based dengan validasi otomatis
- **Cross-language**: Compatible dengan Rust server
- **Performance**: Fast encoding/decoding
- **Backward compatibility**: Versioning support

### Proto Files

Proto files tersedia di masing-masing SDK:

```
sdk/
├── nodejs/proto/osp/v1/*.proto
├── php/proto/osp/v1/*.proto
└── flutter/proto/osp/v1/*.proto
```

### Generating Code

**Node.js:**
```bash
npm run generate:proto
# Generates: src/generated/proto.js + proto.d.ts
```

**PHP:**
```bash
composer generate-proto
# Generates: src/Generated/
```

**Flutter:**
```bash
./scripts/generate-proto.sh
# Generates: lib/generated/
```

### Prerequisites

Untuk generate proto code, Anda perlu:

**Node.js:**
- Node.js 18+
- npm (protobufjs akan di-install otomatis)

**PHP:**
- PHP 8.1+
- protoc compiler: `apt-get install protobuf-compiler`

**Flutter:**
- Flutter SDK
- protoc compiler: `apt-get install protobuf-compiler`
- Dart protoc plugin: `dart pub global activate protoc_plugin`

## 📚 Documentation

- [Node.js SDK](nodejs/README.md)
- [PHP SDK](php/README.md)
- [Flutter SDK](flutter/README.md)
- [Protocol Specification](../docs/protocol.md)

## 🧪 Testing

```bash
# Node.js
cd sdk/nodejs && npm test

# PHP
cd sdk/php && ./vendor/bin/phpunit

# Flutter
cd sdk/flutter && flutter test
```

## 📦 Publishing

### npm (Node.js)
```bash
cd sdk/nodejs
npm run build
npm publish --access public
```

### Packagist (PHP)
```bash
cd sdk/php
# Push to GitHub, then connect to packagist.org
composer update
```

### pub.dev (Flutter)
```bash
cd sdk/flutter
dart pub publish --dry-run
dart pub publish
```

## 🔗 Related

- [OSP Server (Rust)](../crates/owl-server/)
- [Protocol Design](../docs/protocol.md)
- [Architecture](../docs/architecture.md)

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.
