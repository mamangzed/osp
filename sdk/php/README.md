# OSP SDK for PHP

PHP SDK untuk menghubungkan aplikasi PHP ke server OSP (Owl Sync Protocol).

## Instalasi

```bash
composer require owl/osp-sdk
```

## Quick Start

```php
<?php

require_once 'vendor/autoload.php';

use OWL\OSP\Client;

$client = new Client('localhost', 9420, 'your-auth-token');

// Connect ke server
$client->connect();

// Listen untuk events
$client->on('connect', function($msg) {
    echo "Connected to OSP server\n";
});

$client->on('patch', function($op) {
    echo "Received patch: " . json_encode($op) . "\n";
});

// Set record
$client->set('users', 'user-123', [
    'name' => 'Alice',
    'email' => 'alice@example.com',
]);

// Subscribe ke collection
$client->subscribe('users');

// Poll untuk menerima data (non-blocking)
while ($client->isConnected()) {
    $client->poll();
    usleep(10000); // 10ms
}

// Delete record
$client->delete('users', 'user-123');

// Disconnect
$client->disconnect();
```

## API

### Client

#### Constructor

```php
new Client(string $host, int $port, string $token, ?string $deviceId = null)
```

**Parameter:**
- `$host`: string - Server hostname
- `$port`: int - Server port
- `$token`: string - Authentication token
- `$deviceId`: string - Optional device ID (auto-generated jika tidak diberikan)

#### Methods

- `connect(): void` - Connect ke server
- `disconnect(): void` - Disconnect dari server
- `poll(): void` - Poll untuk menerima data (non-blocking)
- `set(string $collection, string $recordId, array $fields): void` - Create atau update record
- `delete(string $collection, string $recordId): void` - Delete record
- `restore(string $collection, string $recordId): void` - Restore record yang sudah di-delete
- `subscribe(string $collection): void` - Subscribe ke collection
- `unsubscribe(string $subscriptionId): void` - Unsubscribe dari collection
- `isConnected(): bool` - Check apakah connected dan authenticated
- `on(string $event, callable $callback): void` - Register event listener
- `getDeviceId(): string` - Get device ID

#### Events

- `connect` - Emitted saat berhasil connect dan authenticated
- `disconnect` - Emitted saat disconnect
- `patch` - Emitted saat menerima patch operation
- `delete` - Emitted saat menerima delete operation
- `restore` - Emitted saat menerima restore operation
- `error` - Emitted saat terjadi error
- `hello_ack` - Emitted saat menerima HELLO_ACK
- `auth_failed` - Emitted saat authentication gagal

## Features

- ✅ TCP connection support
- ✅ Non-blocking I/O
- ✅ Event-based API
- ✅ Frame encoding/decoding
- ✅ Authentication
- ✅ Real-time sync

## Requirements

- PHP >= 8.1
- ext-sockets

## License

MIT
