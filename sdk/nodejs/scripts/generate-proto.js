#!/usr/bin/env node

/**
 * Generate protobuf code from .proto files
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const protoDir = path.join(__dirname, '..', 'proto');
const outDir = path.join(__dirname, '..', 'src');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const jsOut = path.join(outDir, 'osp_pb.js');
const tsOut = path.join(outDir, 'osp_pb.d.ts');

console.log('🔧 Generating protobuf code...');

try {
  // Generate JavaScript module
  // Use --path to set the proto import root so "osp/v1/common.proto" resolves correctly
  const pbjsCmd = [
    'npx pbjs',
    '-t static-module',
    '-w commonjs',
    `--path "${protoDir}"`,
    `-o "${jsOut}"`,
    `"${protoDir}/osp/v1/common.proto"`,
    `"${protoDir}/osp/v1/frame.proto"`,
    `"${protoDir}/osp/v1/auth.proto"`,
    `"${protoDir}/osp/v1/sync.proto"`,
  ].join(' ');

  console.log('Running pbjs...');
  execSync(pbjsCmd, { stdio: 'inherit' });
  console.log('✅ Generated:', jsOut);

  // Generate TypeScript definitions
  const pbtsCmd = `npx pbts -o "${tsOut}" "${jsOut}"`;
  console.log('Running pbts...');
  execSync(pbtsCmd, { stdio: 'inherit' });
  console.log('✅ Generated:', tsOut);

  console.log('🎉 Protobuf generation complete!');
} catch (error) {
  console.error('❌ Protobuf generation failed');
  process.exit(1);
}
