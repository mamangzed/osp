# Node.js OSP Example

Contoh aplikasi real-time dengan Node.js backend worker dan browser frontend yang terhubung ke OSP.

## Arsitektur

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Browser   │ ─────────────────→ │ OSP Server  │
│  (Frontend) │ ←───────────────── │  (Rust)     │
└─────────────┘                    └─────────────┘
                                            ↑
                                            │ WebSocket
                                            │
                                     ┌─────────────┐
                                     │ Node.js     │
                                     │ Worker      │
                                     │ (Backend)   │
                                     └─────────────┘
```

**Flow:**
1. Frontend connect ke OSP via WebSocket (real-time updates)
2. User action (add/delete todo) → Frontend kirim ke OSP
3. OSP broadcast ke semua subscribers (termasuk Node.js worker)
4. Node.js worker process business logic, validation
5. Worker update OSP dengan hasil processing
6. OSP broadcast ke semua clients (termasuk frontend)
7. Semua browsers lihat update real-time!

## Fitur

✅ **Real-time sync** - Todos sync otomatis ke semua connected clients  
✅ **Business logic** - Validation dan processing di backend worker  
✅ **Long-running worker** - Node.js process jalan terus, listen events dari OSP  
✅ **Auto-reconnect** - Worker dan frontend auto-reconnect jika terputus  
✅ **Stats tracking** - Worker update stats ke OSP setiap 10 detik

## Setup

### 1. Install Dependencies

```bash
cd examples/nodejs-app
npm install
```

### 2. Copy Environment File

```bash
cp .env.example .env
```

Edit `.env` sesuai kebutuhan:
```env
OSP_HOST=localhost
OSP_PORT=9420
OSP_WS_PORT=9421
OSP_TOKEN=your-secret-token
HTTP_PORT=3000
```

### 3. Start OSP Server

```bash
# Dari root project
cargo run --release --bin owl-server -- \
  --bind 0.0.0.0:9420 \
  --ws-bind 0.0.0.0:9421
```

### 4. Start Node.js Worker (Backend)

```bash
cd examples/nodejs-app
npm run backend
```

Output:
```
[Worker] Starting Node.js OSP Worker...
[Worker] OSP Server: localhost
[Worker] OSP Port: 9421
[OSP] Connecting to ws://localhost:9421...
[OSP] Connected
[Worker] Connected to OSP server
[Worker] Subscribed to collections: todos, counters
[Worker] Ready and waiting for events...
```

### 5. Start HTTP Server (Frontend)

```bash
npm run frontend
```

Output:
```
[Server] HTTP server running on http://localhost:3000
[Server] Frontend: http://localhost:3000/index.html
```

### 6. Open Browser

Buka `http://localhost:3000` di browser.

**Test real-time sync:**
1. Buka page di 2 browser windows (atau 2 browser berbeda)
2. Add todo di window 1
3. Todo muncul otomatis di window 2!
4. Check/uncheck todo → sync ke semua windows
5. Delete todo → hilang dari semua windows

## Cara Kerja

### Frontend (Browser)

```javascript
// Connect ke OSP
const osp = new OspClient('localhost', 9421, 'your-secret-token');
await osp.connect();

// Subscribe ke collection
await osp.subscribe('todos');

// Listen untuk updates
osp.on('patch', (data) => {
  const { collection, recordId, fields } = data;
  // Update UI
});

// Kirim operation
await osp.set('todos', 'todo-123', {
  title: 'Buy milk',
  completed: false
});
```

### Backend Worker (Node.js)

```javascript
// Connect ke OSP
const osp = new OspClient('localhost', 9421, 'your-secret-token');
await osp.connect();

// Subscribe ke collection
await osp.subscribe('todos');

// Listen untuk operations
osp.on('patch', async (data) => {
  const { collection, recordId, fields } = data;

  // Business logic
  if (collection === 'todos') {
    // Validate
    if (fields.title && fields.title.length < 3) {
      throw new Error('Title too short');
    }

    // Process
    const todo = await saveToDatabase(recordId, fields);

    // Update OSP
    await osp.set('todos', recordId, {
      status: 'confirmed',
      processedAt: Date.now()
    });
  }
});
```

## File Structure

```
examples/nodejs-app/
├── backend/
│   ├── osp-client.js      # OSP client implementation
│   ├── worker.js          # Long-running worker (business logic)
│   └── server.js          # HTTP server (serve frontend)
├── frontend/
│   ├── index.html         # UI
│   ├── app.js             # Frontend logic
│   └── osp-client.js      # OSP client (browser version)
├── .env.example           # Environment template
├── package.json
└── README.md
```

## Business Logic Examples

### Todo Validation

Worker validates todo title:
- Minimum 3 characters
- Maximum 200 characters
- Returns error jika invalid

```javascript
if (fields.title && fields.title.length < 3) {
  throw new Error('Title too short (minimum 3 characters)');
}
```

### Counter Increment

Demonstrates atomic operations:

```javascript
const current = db.counters.get(recordId) || 0;
const newValue = current + increment;
db.counters.set(recordId, newValue);
```

### Periodic Stats Update

Worker update stats setiap 10 detik:

```javascript
setInterval(async () => {
  const stats = {
    totalTodos: db.todos.size,
    totalCounters: db.counters.size,
    updatedAt: Date.now()
  };

  await osp.set('stats', 'worker', stats);
}, 10000);
```

## Production Considerations

### Database

Contoh ini pakai in-memory Map. Untuk production:
- Gunakan Redis untuk fast access
- Atau PostgreSQL/MySQL untuk persistence

```javascript
import Redis from 'ioredis';
const redis = new Redis();

// Save
await redis.set(`todo:${recordId}`, JSON.stringify(todo));

// Load
const data = await redis.get(`todo:${recordId}`);
const todo = JSON.parse(data);
```

### Authentication

Tambahkan authentication:
- JWT tokens
- API keys
- OAuth

```javascript
// Validate token
const user = await validateToken(token);
if (!user) {
  throw new Error('Unauthorized');
}
```

### Error Handling

Tambahkan proper error handling:
- Retry logic
- Circuit breakers
- Error logging

```javascript
import { Logger } from './logger.js';

try {
  await processOperation(data);
} catch (error) {
  Logger.error('Operation failed', { error, data });
  await retryOperation(data);
}
```

### Monitoring

Tambahkan monitoring:
- Prometheus metrics
- Health checks
- Alerting

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    ospConnected: osp.isConnected()
  });
});
```

## Troubleshooting

### "Failed to connect to OSP"

Check:
- OSP server running: `ps aux | grep owl-server`
- WebSocket port open: `netstat -tlnp | grep 9421`
- Token correct: check `.env` file

### "Worker not processing operations"

Check:
- Worker logs: should show `[Worker] Received PATCH: ...`
- OSP server logs: should show broadcast events
- Network connectivity: `telnet localhost 9421`

### "Frontend not receiving updates"

Check:
- Browser console for errors
- WebSocket connection: `ws://localhost:9421`
- OSP server broadcasting events

## Advanced Examples

### Multiple Collections

Worker bisa subscribe ke multiple collections:

```javascript
await osp.subscribe('todos');
await osp.subscribe('users');
await osp.subscribe('notifications');

osp.on('patch', (data) => {
  switch (data.collection) {
    case 'todos':
      handleTodoUpdate(data);
      break;
    case 'users':
      handleUserUpdate(data);
      break;
    case 'notifications':
      handleNotification(data);
      break;
  }
});
```

### Complex Business Logic

```javascript
osp.on('patch', async (data) => {
  if (data.collection === 'orders') {
    // 1. Validate stock
    const product = await getProduct(data.fields.productId);
    if (product.stock < data.fields.quantity) {
      throw new Error('Insufficient stock');
    }

    // 2. Create order
    const order = await createOrder(data.fields);

    // 3. Update stock
    await updateStock(product.id, -data.fields.quantity);

    // 4. Send notification
    await sendNotification(order.userId, 'Order created');

    // 5. Update OSP
    await osp.set('orders', order.id, {
      status: 'confirmed',
      total: order.total
    });
  }
});
```

### Rate Limiting

```javascript
const rateLimiter = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;

  if (!rateLimiter.has(userId)) {
    rateLimiter.set(userId, []);
  }

  const requests = rateLimiter.get(userId);
  const recentRequests = requests.filter(t => now - t < windowMs);

  if (recentRequests.length >= maxRequests) {
    throw new Error('Rate limit exceeded');
  }

  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);
}
```

## License

MIT
