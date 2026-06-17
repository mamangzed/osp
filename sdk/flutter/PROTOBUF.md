# Flutter SDK - Protobuf Generation

## Prerequisites

Pastikan Flutter dan Dart sudah terinstall di system Anda:

```bash
# Install Flutter (jika belum)
# https://docs.flutter.dev/get-started/install

# Verify installation
flutter --version
dart --version
```

## Install protoc-gen-dart

Plugin ini diperlukan untuk generate Dart code dari `.proto` files:

```bash
dart pub global activate protoc_plugin

# Tambahkan ke PATH (tambahkan ke ~/.bashrc atau ~/.zshrc)
export PATH="$PATH:$HOME/.pub-cache/bin"

# Verify installation
protoc-gen-dart --version
```

## Generate Protobuf Code

Dari directory `sdk/flutter`:

```bash
# Copy proto files dari main repo
cp -r ../../proto .

# Generate Dart protobuf code
protoc --proto_path=proto --dart_out=lib/generated \
  proto/osp/v1/common.proto \
  proto/osp/v1/frame.proto \
  proto/osp/v1/auth.proto \
  proto/osp/v1/sync.proto
```

Atau gunakan script otomatis:

```bash
chmod +x scripts/generate-proto.sh
./scripts/generate-proto.sh
```

## Generated Files

Setelah generation, Anda akan punya files di `lib/generated/`:

```
lib/generated/
├── osp/v1/
│   ├── common.pb.dart
│   ├── frame.pb.dart
│   ├── auth.pb.dart
│   └── sync.pb.dart
```

## Usage in Flutter Code

Import generated files di `lib/src/client.dart`:

```dart
import 'generated/osp/v1/common.pb.dart';
import 'generated/osp/v1/frame.pb.dart';
import 'generated/osp/v1/auth.pb.dart';
import 'generated/osp/v1/sync.pb.dart';
```

## Troubleshooting

### Error: protoc-gen-dart not found

```bash
# Check PATH
echo $PATH

# Add pub-cache/bin to PATH
export PATH="$PATH:$HOME/.pub-cache/bin"
```

### Error: proto files not found

Pastikan proto files sudah di-copy:

```bash
ls -la proto/osp/v1/
# Should show: common.proto, frame.proto, auth.proto, sync.proto
```

### Generated files missing

Jalankan ulang generation command. Pastikan `lib/generated/` directory ada:

```bash
mkdir -p lib/generated
```

## Example Usage

Setelah protobuf generated, Anda bisa test Flutter client:

```dart
import 'package:owl_osp_sdk/client.dart';

void main() async {
  final client = OspClient();
  
  await client.connect(
    host: 'localhost',
    port: 8080,
  );
  
  // Listen to operations
  client.onOperation = (op) {
    print('Received op: ${op.id}');
  };
  
  // Subscribe to collection
  await client.subscribe('users');
}
```

## Regenerate After Proto Changes

Jika proto files di main repo berubah, regenerate:

```bash
cd sdk/flutter
rm -rf lib/generated/*
cp -r ../../proto .
./scripts/generate-proto.sh
```

## Build & Test

```bash
# Get dependencies
flutter pub get

# Run tests (jika ada)
flutter test

# Build example app
cd example
flutter run
```

## Package Structure

```
sdk/flutter/
├── lib/
│   ├── src/
│   │   ├── client.dart          # Main client implementation
│   │   ├── frame.dart           # Frame encoding/decoding
│   │   └── types.dart           # Type definitions
│   ├── generated/               # Generated protobuf code
│   │   └── osp/v1/*.pb.dart
│   └── owl_osp_sdk.dart         # Public API
├── proto/                       # Proto files (copied from main)
│   └── osp/v1/*.proto
├── scripts/
│   └── generate-proto.sh        # Generation script
├── pubspec.yaml
└── README.md
```

## Dependencies

Dari `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  protobuf: ^3.1.0
  fixnum: ^1.1.0
```

## Notes

- Generated files **tidak** di-commit ke Git (tambahkan ke `.gitignore`)
- Selalu regenerate setelah update proto files
- Pastikan version `protobuf` package compatible dengan `protoc-gen-dart`
