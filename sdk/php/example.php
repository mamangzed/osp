<?php
/**
 * Contoh penggunaan OSP PHP SDK
 */

require_once __DIR__ . '/vendor/autoload.php';

use Owl\Osp\Client;
use Owl\Osp\Config;

// Konfigurasi
$config = new Config();
$config->host = '127.0.0.1';
$config->port = 9420;
$config->token = 'test-token';
$config->deviceId = 'php-client-1';
$config->timeout = 30;

// Buat client
$client = new Client($config);

// Event handlers
$client->on('connected', function() {
    echo "✓ Terhubung ke server\n";
});

$client->on('authenticated', function($msg) {
    echo "✓ Autentikasi berhasil\n";
});

$client->on('op', function($op) {
    echo "✓ Menerima operasi: " . json_encode($op) . "\n";
});

$client->on('error', function($err) {
    echo "✗ Error: " . $err . "\n";
});

$client->on('disconnected', function() {
    echo "✓ Terputus dari server\n";
});

try {
    // Koneksi ke server
    echo "Menghubungkan ke server...\n";
    $client->connect();

    // Subscribe ke collection
    echo "Subscribe ke collection 'users'...\n";
    $client->subscribe('users');

    // Set record
    echo "Membuat record baru...\n";
    $client->set('users', 'user-1', [
        'name' => 'Alice',
        'email' => 'alice@example.com',
        'age' => 30
    ]);

    // Update record
    echo "Update record...\n";
    $client->set('users', 'user-1', [
        'age' => 31
    ]);

    // Tunggu sebentar untuk menerima operasi
    sleep(1);

    // Delete record
    echo "Delete record...\n";
    $client->delete('users', 'user-1');

    // Tunggu sebentar
    sleep(1);

    // Restore record
    echo "Restore record...\n";
    $client->restore('users', 'user-1');

    // Tunggu sebentar
    sleep(1);

    // Unsubscribe
    echo "Unsubscribe dari collection...\n";
    $client->unsubscribe('users');

    // Disconnect
    echo "Disconnect...\n";
    $client->disconnect();

    echo "\n✓ Semua operasi berhasil!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
