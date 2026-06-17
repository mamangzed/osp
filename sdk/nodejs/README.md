# OSP SDK for Node.js

Node.js SDK for connecting to OSP (Owl Sync Protocol) servers.

## Installation

```bash
npm install @owl/osp-sdk
```

## Quick Start

```typescript
import { OSPClient } from '@owl/osp-sdk';

const client = new OSPClient({
  host: 'localhost',
  port: 9420,
  token: 'your-auth-token',
});

// Connect to server
await client.connect();

// Listen for events
client.on('connect', () => {
  console.log('Connected to OSP server');
});

client.on('patch', (op) => {
  console.log('Received patch:', op);
});

// Set a record
await client.set('users', 'user-123', {
  name: 'Alice',
  email: 'alice@example.com',
});

// Subscribe to a collection
await client.subscribe('users');

// Delete a record
await client.delete('users', 'user-123');

// Disconnect
await client.disconnect();
```

## API

### OSPClient

#### Constructor

```typescript
new OSPClient(config: ClientConfig)
```

**ClientConfig:**
- `host`: string - Server hostname
- `port`: number - Server port
- `token`: string - Authentication token
- `deviceId?`: string - Optional device ID (auto-generated if not provided)

#### Methods

- `connect(): Promise<void>` - Connect to the server
- `disconnect(): Promise<void>` - Disconnect from the server
- `set(collection: string, recordId: string, fields: Record<string, any>): Promise<void>` - Create or update a record
- `delete(collection: string, recordId: string): Promise<void>` - Delete a record
- `restore(collection: string, recordId: string): Promise<void>` - Restore a deleted record
- `subscribe(collection: string): Promise<void>` - Subscribe to a collection
- `unsubscribe(subscriptionId: string): Promise<void>` - Unsubscribe from a collection
- `isConnected(): boolean` - Check if connected and authenticated

#### Events

- `connect` - Emitted when successfully connected and authenticated
- `disconnect` - Emitted when disconnected
- `patch` - Emitted when a patch operation is received
- `delete` - Emitted when a delete operation is received
- `restore` - Emitted when a restore operation is received
- `error` - Emitted when an error occurs
- `hello_ack` - Emitted when HELLO_ACK is received
- `auth_failed` - Emitted when authentication fails

## Features

- ✅ TCP connection support
- ✅ Automatic reconnection
- ✅ Event-based API
- ✅ TypeScript support
- ✅ Frame encoding/decoding
- ✅ Authentication
- ✅ Real-time sync

## License

MIT
