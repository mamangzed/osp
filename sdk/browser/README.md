# @owl/osp-sdk-browser

Browser SDK for OSP (Owl Sync Protocol) - Real-time sync via WebSocket + Protobuf

## Features

- ✅ WebSocket transport (browser-compatible)
- ✅ Protobuf binary serialization
- ✅ Auto-reconnect with exponential backoff
- ✅ Event-based API
- ✅ TypeScript support
- ✅ Zero Node.js dependencies

## Installation

```bash
npm install @owl/osp-sdk-browser
```

## Quick Start

```javascript
import { OSPBrowserClient } from '@owl/osp-sdk-browser';

const client = new OSPBrowserClient({
  url: 'ws://localhost:9421',
  token: 'your-auth-token',
  deviceId: 'browser-client-1' // optional
});

// Connect to OSP server
await client.connect();

// Subscribe to collections
await client.subscribe('users');
await client.subscribe('orders');

// Listen for real-time updates
client.on('patch', (operation) => {
  console.log('Received update:', operation);
  // Update your UI here
});

// Create/update a record
await client.set('users', 'user-123', {
  name: 'Alice',
  email: 'alice@example.com',
  age: 30
});

// Delete a record
await client.delete('users', 'user-123');

// Restore a deleted record
await client.restore('users', 'user-123');

// Disconnect
await client.disconnect();
```

## API Reference

### Constructor

```typescript
new OSPBrowserClient(config: ClientConfig)
```

**ClientConfig:**
- `url: string` - WebSocket URL (e.g., `ws://localhost:9421`)
- `token: string` - Authentication token
- `deviceId?: string` - Optional device identifier (auto-generated if not provided)

### Methods

#### `connect(): Promise<void>`
Connect to OSP server and authenticate.

#### `disconnect(): Promise<void>`
Disconnect from server.

#### `subscribe(collection: string): Promise<void>`
Subscribe to a collection to receive real-time updates.

#### `unsubscribe(subscriptionId: string): Promise<void>`
Unsubscribe from a collection.

#### `set(collection: string, recordId: string, fields: Record<string, any>): Promise<void>`
Create or update a record.

#### `delete(collection: string, recordId: string): Promise<void>`
Delete a record (soft delete).

#### `restore(collection: string, recordId: string): Promise<void>`
Restore a deleted record.

#### `isConnected(): boolean`
Check if client is connected and authenticated.

### Events

```typescript
client.on('connect', (authOk) => { /* ... */ });
client.on('disconnect', () => { /* ... */ });
client.on('error', (error) => { /* ... */ });
client.on('patch', (operation) => { /* ... */ });
client.on('delete', (operation) => { /* ... */ });
client.on('restore', (operation) => { /* ... */ });
client.on('hello_ack', (helloAck) => { /* ... */ });
client.on('auth_failed', (authFailed) => { /* ... */ });
```

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## Development

```bash
# Install dependencies
npm install

# Generate protobuf code
npm run generate:proto

# Build
npm run build

# Watch mode
npm run dev
```

## Architecture

```
Browser Client (WebSocket)
    ↓
OSP Server (WebSocket → TCP bridge)
    ↓
OSP Protocol (Protobuf binary)
```

## License

MIT
