/**
 * Contoh penggunaan OSP Node.js SDK
 */

const { OSPClient } = require('./dist');

async function main() {
  // Buat client
  const client = new OSPClient({
    host: '127.0.0.1',
    port: 9420,
    token: 'test-token',
    deviceId: 'node-client-1'
  });

  // Event listeners
  client.on('connected', () => {
    console.log('✓ Terhubung ke server');
  });

  client.on('authenticated', (msg) => {
    console.log('✓ Autentikasi berhasil:', msg);
  });

  client.on('op', (op) => {
    console.log('✓ Menerima operasi:', op);
  });

  client.on('error', (err) => {
    console.error('✗ Error:', err);
  });

  client.on('disconnected', () => {
    console.log('✓ Terputus dari server');
  });

  try {
    // Koneksi ke server
    console.log('Menghubungkan ke server...');
    await client.connect();

    // Subscribe ke collection
    console.log('Subscribe ke collection "users"...');
    await client.subscribe('users');

    // Set record
    console.log('Membuat record baru...');
    await client.set('users', 'user-1', {
      name: 'Alice',
      email: 'alice@example.com',
      age: 30
    });

    // Update record
    console.log('Update record...');
    await client.set('users', 'user-1', {
      age: 31
    });

    // Tunggu sebentar untuk menerima operasi
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Delete record
    console.log('Delete record...');
    await client.delete('users', 'user-1');

    // Tunggu sebentar
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Restore record
    console.log('Restore record...');
    await client.restore('users', 'user-1');

    // Tunggu sebentar
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Unsubscribe
    console.log('Unsubscribe dari collection...');
    await client.unsubscribe('users');

    // Disconnect
    console.log('Disconnect...');
    await client.disconnect();

    console.log('\n✓ Semua operasi berhasil!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
