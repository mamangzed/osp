#!/usr/bin/env php
<?php

/**
 * Generate PHP protobuf classes from .proto files
 * Requires: protoc and grpc_php_plugin installed
 */

$protoDir = __DIR__ . '/../proto/osp/v1';
$outDir = __DIR__ . '/../src/Generated';

if (!is_dir($outDir)) {
    mkdir($outDir, 0755, true);
}

$protoFiles = [
    'common.proto',
    'auth.proto',
    'sync.proto',
    'frame.proto'
];

echo "Generating PHP protobuf classes...\n";

// Build protoc command
$protoc = 'protoc';
$protoPath = realpath($protoDir . '/../../');
$phpOut = realpath($outDir);

foreach ($protoFiles as $file) {
    $protoFile = $protoDir . '/' . $file;
    if (!file_exists($protoFile)) {
        echo "Warning: $file not found, skipping\n";
        continue;
    }

    $cmd = sprintf(
        '%s --proto_path=%s --php_out=%s %s 2>&1',
        $protoc,
        escapeshellarg($protoPath),
        escapeshellarg($phpOut),
        escapeshellarg($protoFile)
    );

    echo "Compiling: $file\n";
    $output = [];
    $returnVar = 0;
    exec($cmd, $output, $returnVar);

    if ($returnVar !== 0) {
        echo "Error compiling $file:\n";
        echo implode("\n", $output) . "\n";
        echo "Make sure protoc is installed: apt-get install protobuf-compiler\n";
        exit(1);
    }
}

echo "✓ Generated PHP protobuf classes in $outDir\n";
echo "✓ Proto generation complete\n";
