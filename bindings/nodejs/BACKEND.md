# OSP Node.js Backend Guide

This guide covers building a production-ready backend server using the `@owl/osp` Node.js SDK.

## Architecture Overview

The Node.js `OwlServer` is a single-process TCP/TLS server that handles:
1. **Connection Lifecycle**: HELLO → AUTH → Session creation.
2. **State Management**: Maintains an in-memory `SyncEngine` for records, vector clocks, and op logs.
3. **Subscription Routing**: Filters incoming operations and fans them out to subscribed clients.
4. **Heartbeat**: Keeps connections alive and detects dead peers.

> **Note**: The default `SyncEngine` is **in-memory**. For production, you should extend it to persist data to a database (e.g., PostgreSQL, Redis, or SQLite).

---

## 1. Basic Server Setup

```typescript
import { OwlServer } from '@owl/osp';

const server = new OwlServer({
  port: 9420,
  host: '0.0.0.0',
  heartbeatIntervalMs: 15000,
  validateToken: async (token: string) => {
    // Example: Verify JWT or check API key against your database
    const user = await db.users.findByToken(token);
    if (user) {
      return { 
        valid: true, 
        deviceId: user.deviceId, 
        scopes: user.allowedCollections // e.g., ['users', 'orders']
      };
    }
    return { valid: false };
  },
});

await server.listen();
console.log('🦉 OSP Server running on port 9420');

// Graceful shutdown
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
```

---

## 2. Authentication & Authorization

The `validateToken` function is your hook into your existing auth system. It runs on every new connection during the `AUTH` phase.

- **Return `{ valid: true, deviceId: '...', scopes: ['*'] }`** to accept the connection.
- **Return `{ valid: false }`** to reject it (server sends `AUTH_FAILED` and closes the socket).
- **`scopes`**: An array of collection names the device is allowed to interact with. The server can be extended to enforce these scopes before applying operations.

### Example: JWT Validation
```typescript
import jwt from 'jsonwebtoken';

const server = new OwlServer({
  port: 9420,
  validateToken: (token: string) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return {
        valid: true,
        deviceId: payload.sub, // Use user ID or device ID
        scopes: payload.scopes || ['*'],
      };
    } catch {
      return { valid: false };
    }
  },
});
```

---

## 3. Persistent Storage Integration

The default `SyncEngine` stores everything in memory. To make it production-ready, wrap or extend it to persist to your database.

### Example: PostgreSQL Integration Hook

```typescript
import { SyncEngine, OperationMsg, RecordMsg } from '@owl/osp';
import { Pool } from 'pg';

const db = new Pool({ connectionString: process.env.DATABASE_URL });

class PersistentSyncEngine extends SyncEngine {
  constructor(deviceId: string) {
    super(deviceId);
  }

  // Override or hook into applyRemote to persist to DB
  async applyRemoteAndPersist(op: OperationMsg): Promise<boolean> {
    const applied = super.applyRemote(op);
    if (applied) {
      await db.query(
        `INSERT INTO op_log (op_id, collection, record_id, payload, lamport) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (op_id) DO NOTHING`,
        [op.op_id, op.collection, op.record_id, JSON.stringify(op), op.lamport]
      );
    }
    return applied;
  }

  // Hook into local mutations to persist immediately
  async localSetFieldAndPersist(coll: string, recordId: string, field: string, value: any) {
    const op = super.localSetField(coll, recordId, field, value);
    await db.query(
      `INSERT INTO op_log (op_id, collection, record_id, payload, lamport) 
       VALUES ($1, $2, $3, $4, $5)`,
      [op.op_id, coll, recordId, JSON.stringify(op), op.lamport]
    );
    return op;
  }
}
```
*(Note: You would need to modify the SDK source to expose these hooks, or wrap the `OwlServer` event loop to intercept ops before they are applied).*

---

## 4. Handling Subscriptions & Fan-out

When a client subscribes, the server tracks the `subscription_id` and `collection`. When any client pushes an `Op` to that collection, the server automatically fans it out to all other subscribed clients via `SyncPush`.

### Custom Fan-out Logic
If you need to filter fan-out based on user permissions (e.g., "only send updates to users in the same workspace"), you can intercept the `handleEnvelope` method by extending `OwlServer`:

```typescript
import { OwlServer, Session, Envelope, OperationMsg } from '@owl/osp';

class WorkspaceAwareServer extends OwlServer {
  protected async fanOut(senderSessionId: string, op: OperationMsg): Promise<void> {
    for (const [sid, session] of this.sessions) {
      if (sid === senderSessionId) continue;
      
      // Custom logic: only fan out if the subscriber has access to this record's workspace
      const hasAccess = await this.checkWorkspaceAccess(session.deviceId, op.collection, op.record_id);
      if (hasAccess) {
        try {
          const pushEnv = new Envelope({ type: 'SyncPush', data: { ops: [op] } });
          const frame = Frame.create(pushEnv.opcode, 0n, pushEnv.encode());
          await session.connection.writeFrame(frame);
        } catch {
          this.removeSession(sid); // Client disconnected
        }
5. Scaling Considerations

The Node.js `OwlServer` is **single-process**. It holds all sessions and state in memory.

### Vertical Scaling
Node.js can handle tens of thousands of concurrent TCP connections on a single instance. Ensure you:
- Increase OS file descriptor limits (`ulimit -n 65535`).
- Use a load balancer (e.g., HAProxy, NGINX) with **TCP passthrough** (not HTTP) to distribute connections across multiple Node.js processes on the same machine.

### Horizontal Scaling (Multi-Node)
If you need to scale across multiple servers, you cannot use the default in-memory `OwlServer` as-is, because sessions and state are isolated per process.

**Solutions:**
1. **Sticky Sessions by Device**: Route all connections from `deviceId=X` to the same Node.js instance using a consistent hashing load balancer. (Easiest, but fragile if a node dies).
2. **External State Store**: Modify the server to use Redis or PostgreSQL as the source of truth for the `SyncEngine` (OpLog, Vector Clocks, Records).
3. **Message Broker for Fan-out**: Use Redis Pub/Sub or Kafka. When a Node.js instance receives an `Op`, it applies it locally, saves to DB, and publishes to a Redis channel. All Node.js instances listen to this channel and fan out to their locally connected subscribers.

> **Future**: The Rust OSP implementation has `owl-cluster` (Phase 2) planned for native multi-node Raft-based replication. The Node.js SDK is best suited for edge servers, BaaS backends, or single-instance deployments until a Node.js clustering module is added.

---

## 6. TLS / Encrypted Connections

For production, always use TLS. The SDK supports it natively.

```typescript
import * as fs from 'fs';
import { OwlServer } from '@owl/osp';

const server = new OwlServer({
  port: 9420,
  // The underlying net/tls module will use these if provided in a custom setup,
  // or you can wrap the server creation:
});

// Note: Current SDK `OwlServer` uses `net.createServer`. 
// To enable TLS, you would modify `server.ts` to use `tls.createServer`:
import * as tls from 'tls';

const tlsServer = tls.createServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
}, (socket) => {
  // ... same connection handling logic
});
```
*(You can update `src/server.ts` to accept `tlsOptions` in `ServerConfig` to enable this natively).*

---

## 7. Monitoring & Observability

Add logging and metrics to your server instance:

```typescript
const server = new OwlServer({
  port: 9420,
  validateToken: (token) => { /* ... */ }
});

// Hook into server events (you may need to extend the class to expose these)
console.log('Server started. Monitor /health endpoint separately.');
```

Recommended metrics to track:
- Active connections (sessions.size)
- Ops received per second
- Auth failures
- Memory usage (Node.js `process.memoryUsage()`)

---

## 8. Example: Full Production-Ready Server

```typescript
import { OwlServer } from '@owl/osp';
import dotenv from 'dotenv';
dotenv.config();

const server = new OwlServer({
  port: parseInt(process.env.PORT || '9420', 10),
  host: process.env.HOST || '0.0.0.0',
  heartbeatIntervalMs: 15000,
  validateToken: async (token: string) => {
    // Replace with your actual auth logic
    if (token === process.env.ADMIN_TOKEN) {
      return { valid: true, deviceId: 'admin', scopes: ['*'] };
    }
    return { valid: false };
  },
});

server.listen().then(() => {
  console.log(`✅ OSP Server listening on ${process.env.HOST || '0.0.0.0'}:${process.env.PORT || '9420'}`);
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close();
  process.exit(0);
});
```