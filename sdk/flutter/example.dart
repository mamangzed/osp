import 'package:owl_osp_sdk/owl_osp_sdk.dart';

void main() async {
  // Buat client
  final client = OspClient(
    host: '127.0.0.1',
    port: 9420,
    token: 'test-token',
    deviceId: 'flutter-client-1',
  );

  // Event listeners
  client.on('connected', () {
    print('✓ Terhubung ke server');
  });

  client.on('authenticated', (msg) {
    print('✓ Autentikasi berhasil: $msg');
  });

  client.on('op', (op) {
    print('✓ Menerima operasi: $op');
  });

  client.on('error', (err) {
    print('✗ Error: $err');
  });

  client.on('disconnected', () {
    print('✓ Terputus dari server');
  });

  try {
    // Koneksi ke server
    print('Menghubungkan ke server...');
    await client.connect();

    // Subscribe ke collection
    print('Subscribe ke collection "users"...');
    await client.subscribe('users');

    // Set record
    print('Membuat record baru...');
    await client.set('users', 'user-1', {
      'name': 'Alice',
      'email': 'alice@example.com',
      'age': 30,
    });

    // Update record
    print('Update record...');
    await client.set('users', 'user-1', {
      'age': 31,
    });

    // Tunggu sebentar untuk menerima operasi
    await Future.delayed(Duration(seconds: 1));

    // Delete record
    print('Delete record...');
    await client.delete('users', 'user-1');

    // Tunggu sebentar
    await Future.delayed(Duration(seconds: 1));

    // Restore record
    print('Restore record...');
    await client.restore('users', 'user-1');

    // Tunggu sebentar
    await Future.delayed(Duration(seconds: 1));

    // Unsubscribe
    print('Unsubscribe dari collection...');
    await client.unsubscribe('users');

    // Disconnect
    print('Disconnect...');
    await client.disconnect();

    print('\n✓ Semua operasi berhasil!');
  } catch (err) {
    print('Error: $err');
    exit(1);
  }
}
