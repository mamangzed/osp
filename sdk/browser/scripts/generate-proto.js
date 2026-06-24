#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const protoRoot = path.join(__dirname, '..', 'proto');
const protoDir = path.join(protoRoot, 'osp', 'v1');
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
  // --path must point to proto root so imports like "osp/v1/common.proto" resolve correctly
  const pbjsCmd = `npx pbjs -t static-module -w commonjs --path "${protoRoot}" -o "${jsOut}" ${protoDir}/*.proto`;
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
