/**
 * Test script - OSP Node.js SDK
 * Run: npm run build && npm test
 */

import { OwlServer } from './server';
import { OwlClient } from './client';
import { VectorClockImpl, SyncEngine } from './engine';
import { FrameHeader, Envelope, OpCode, PROTOCOL_VERSION, MAGIC, HEADER_LEN } from './protocol';
import { OpKind, Capability } from './types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${msg}`);
  } else {
    failed++;
    console.error(`  ❌ ${msg}`);
  }
}

async function testVectorClock() {
  console.log('\n📦 VectorClock');
  const vc1 = new VectorClockImpl();
  vc1.set('device-a', 1);
  vc1.set('device-b', 2);

  const vc2 = new VectorClockImpl();
  vc2.set('device-a', 3);
  vc2.set('device-c', 1);

  assert(vc1.get('device-a') === 1, 'get device-a');
  assert(vc1.get('device-b') === 2, 'get device-b');
  assert(vc1.get('device-c') === 0, 'get unknown = 0');

  vc1.merge(vc2);
  assert(vc1.get('device-a') === 3, 'merge picks max');
  assert(vc1.get('device-b') === 2, 'merge keeps existing');
  assert(vc1.get('device-c') === 1, 'merge adds new');

  assert(vc1.dominates(vc2), 'vc1 dominates vc2 after merge');

  const vc3 = new VectorClockImpl();
  vc3.set('device-a', 5);
  assert(!vc1.dominates(vc3), 'vc1 does not dominate vc3');
}

async function testSyncEngine() {
  console.log('\n📦 SyncEngine');
  const engine = new SyncEngine('device-1');

  const op1 = engine.localSetField('users', 'u1', 'name', 'alice');
  assert(op1.kind === OpKind.Update, 'localSetField kind = Update');
  assert(op1.lamport === 1, 'lamport = 1');
  assert(op1.field_changes.length === 1, 'one field change');
  assert(op1.field_changes[0].field_name === 'name', 'field = name');

  const rec = engine.getRecord('users', 'u1');
  assert(rec !== null, 'getRecord not null');
  assert(rec!.fields['name'] === 'alice', 'name = alice');
  assert(rec!.tombstone === false, 'not tombstoned');

  const op2 = engine.localDelete('users', 'u1');
  assert(op2.kind === OpKind.Delete, 'localDelete kind = Delete');
  const rec2 = engine.getRecord('users', 'u1');
  assert(rec2!.tombstone === true, 'tombstoned after delete');

  const op3 = engine.localRestore('users', 'u1');
  assert(op3.kind === OpKind.Restore, 'localRestore kind = Restore');
  const rec3 = engine.getRecord('users', 'u1');
  assert(rec3!.tombstone === false, 'restored');
}

async function testLWWMerge() {
  console.log('\n📦 LWW Merge');
  const engine1 = new SyncEngine('device-1');
  const engine2 = new SyncEngine('device-2');

  // Both set same field concurrently
  const op1 = engine1.localSetField('users', 'u1', 'name', 'alice');
  const op2 = engine2.localSetField('users', 'u1', 'name', 'bob');

  // Apply remote ops to each other
  engine1.applyRemote(op2);
  engine2.applyRemote(op1);

  const rec1 = engine1.getRecord('users', 'u1');
  const rec2 = engine2.getRecord('users', 'u1');

  // Both should converge to same value (device-2 wins lexicographically)
  assert(rec1!.fields['name'] === rec2!.fields['name'], 'converged to same value');
  assert(rec1!.fields['name'] === 'bob', 'device-2 wins (higher device_id)');
}

async function testIdempotentReplay() {
  console.log('\n📦 Idempotent Replay');
  const engine = new SyncEngine('device-1');
  const op = engine.localSetField('users', 'u1', 'name', 'alice');

  const engine2 = new SyncEngine('device-2');
  const first = engine2.applyRemote(op);
  const second = engine2.applyRemote(op);

  assert(first === true, 'first apply accepted');
  assert(second === false, 'second apply rejected (idempotent)');
}

async function testFrameHeader() {
  console.log('\n📦 FrameHeader');
  const header = new FrameHeader(OpCode.Patch, PROTOCOL_VERSION, 0, 1234, 0xDEADBEEFn);
  const encoded = header.encode();

  assert(encoded.length === HEADER_LEN, `encoded length = ${HEADER_LEN}`);
  assert(encoded.subarray(0, 4).equals(MAGIC), 'magic = OWL1');

  const decoded = FrameHeader.decode(encoded);
  assert(decoded.opcode === OpCode.Patch, 'opcode round-trip');
  assert(decoded.version === PROTOCOL_VERSION, 'version round-trip');
  assert(decoded.length === 1234, 'length round-trip');
  assert(decoded.req_id === 0xDEADBEEFn, 'req_id round-trip');
}

async function testEnvelope() {
  console.log('\n📦 Envelope');
  const env = new Envelope({
    type: 'Hello',
    data: {
      protocol_version: 1,
      sdk_version: 'test',
      device_id: 'd1',
      device_platform: 'linux',
      capabilities: [Capability.Chunking],
    },
  });

  assert(env.opcode === OpCode.Hello, 'opcode = Hello');

  const encoded = env.encode();
  assert(encoded.length > 0, 'encoded not empty');

  const decoded = Envelope.decode(OpCode.Hello, encoded);
  assert(decoded.payload.type === 'Hello', 'decoded type = Hello');
  assert((decoded.payload.data as any).sdk_version === 'test', 'sdk_version preserved');
}

async function testPredicate() {
  console.log('\n📦 Predicate Filter');
  const engine = new SyncEngine('device-1');
  engine.localSetField('users', 'u1', 'name', 'alice');
  engine.localSetField('users', 'u1', 'age', 25);
  engine.localSetField('users', 'u2', 'name', 'bob');
  engine.localSetField('users', 'u2', 'age', 30);

  const all = engine.listRecords('users');
  assert(all.length === 2, 'listRecords returns 2');

  const filtered = engine.listRecords('users', {
    kind: 'eq' as any,
    field: 'name',
    value: 'alice',
  });
  assert(filtered.length === 1, 'predicate eq filters to 1');
  assert(filtered[0].record_id === 'u1', 'filtered record = u1');
}

async function testClientServer() {
  console.log('\n📦 Client-Server Integration');

  const server = new OwlServer({
    port: 0, // Random port
    validateToken: (token) => ({ valid: token === 'test-token', deviceId: 'server-device', scopes: ['*'] }),
  });

  // Get actual port
  const net = await import('net');
  const actualPort = await new Promise<number>((resolve) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const addr = srv.address() as any;
      resolve(addr.port);
      srv.close();
    });
  });

  server.config.port = actualPort;
  await server.listen();
  console.log(`  Server listening on port ${actualPort}`);

  const client = new OwlClient({
    url: `tcp://127.0.0.1:${actualPort}`,
    token: 'test-token',
    deviceId: 'client-device',
  });

  await client.connect();
  assert(client.get('users', 'u1') === null, 'initially empty');

  await client.set('users', 'u1', 'name', 'alice');
  const rec = client.get('users', 'u1');
  assert(rec !== null, 'record exists after set');
  assert(rec!.fields['name'] === 'alice', 'name = alice');

  await client.delete('users', 'u1');
  const rec2 = client.get('users', 'u1');
  assert(rec2!.tombstone === true, 'tombstoned after delete');

  await client.restore('users', 'u1');
  const rec3 = client.get('users', 'u1');
  assert(rec3!.tombstone === false, 'restored');

  client.disconnect();
  server.close();
  console.log('  Client-Server test complete');
}

async function main() {
  console.log('🦉 OSP Node.js SDK Tests');
  console.log('='.repeat(40));

  await testVectorClock();
  await testSyncEngine();
  await testLWWMerge();
  await testIdempotentReplay();
  await testFrameHeader();
  await testEnvelope();
  await testPredicate();
  await testClientServer();

  console.log('\n' + '='.repeat(40));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
