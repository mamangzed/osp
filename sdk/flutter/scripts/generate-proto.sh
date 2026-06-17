#!/bin/bash

# Generate Dart protobuf classes from .proto files
# Requires: protoc and protoc-gen-dart installed

set -e

PROTO_DIR="$(dirname "$0")/../proto/osp/v1"
OUT_DIR="$(dirname "$0")/../lib/generated"

if [ ! -d "$OUT_DIR" ]; then
    mkdir -p "$OUT_DIR"
fi

PROTO_FILES=(
    "common.proto"
    "auth.proto"
    "sync.proto"
    "frame.proto"
)

echo "Generating Dart protobuf classes..."

PROTO_PATH="$(realpath "$PROTO_DIR/../../")"

for file in "${PROTO_FILES[@]}"; do
    PROTO_FILE="$PROTO_DIR/$file"
    if [ ! -f "$PROTO_FILE" ]; then
        echo "Warning: $file not found, skipping"
        continue
    fi

    echo "Compiling: $file"
    protoc --proto_path="$PROTO_PATH" \
           --dart_out="$OUT_DIR" \
           "$PROTO_FILE" || {
        echo "Error compiling $file"
        echo "Make sure protoc and protoc-gen-dart are installed:"
        echo "  apt-get install protobuf-compiler"
        echo "  dart pub global activate protoc_plugin"
        exit 1
    }
done

echo "✓ Generated Dart protobuf classes in $OUT_DIR"
echo "✓ Proto generation complete"
