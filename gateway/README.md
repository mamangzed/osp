# OSP HTTP API Gateway

Gateway yang memungkinkan PHP backend menggunakan OSP via HTTP REST API.

## Arsitektur

```
┌──────────────┐  HTTP REST  ┌──────────────┐   TCP    ┌──────────────┐
│  PHP Backend │ ──────────→ │   Gateway    │ ──────→  │  OSP Server  │
│  (Laravel)   │ ←────────── │  (Node.js)   │ ←──────  │   (Rust)     │
└──────────────┘             └──────────────┘          └──────────────┘
```

## Setup

### 1. Install Dependencies

```bash
cd gateway
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
OSP_HOST=localhost
OSP_PORT=9420
OSP_TOKEN=gateway-token
GATEWAY_PORT=3001
JWT_SECRET=your-jwt-secret-change-this-in-production
CORS_ORIGIN=*
```

### 3. Start Gateway

```bash
npm start
```

Gateway akan berjalan di `http://localhost:3001`

## API Endpoints

### POST /api/set
Create atau update record.

**Request:**
```json
{
  "collection": "todos",
  "recordId": "todo-123",
  "fields": {
    "title": "Buy groceries",
    "completed": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Record updated",
  "data": {
    "collection": "todos",
    "recordId": "todo-123"
  }
}
```

### DELETE /api/delete
Delete record.

**Request:**
```json
{
  "collection": "todos",
  "recordId": "todo-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Record deleted",
  "data": {
    "collection": "todos",
    "recordId": "todo-123"
  }
}
```

### POST /api/restore
Restore deleted record.

**Request:**
```json
{
  "collection": "todos",
  "recordId": "todo-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Record restored",
  "data": {
    "collection": "todos",
    "recordId": "todo-123"
  }
}
```

### POST /api/subscribe
Subscribe ke collection untuk menerima updates.

**Request:**
```json
{
  "collection": "todos"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscribed to collection",
  "data": {
    "collection": "todos"
  }
}
```

### POST /api/unsubscribe
Unsubscribe dari collection.

**Request:**
```json
{
  "subscriptionId": "sub-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Unsubscribed from collection",
  "data": {
    "subscriptionId": "sub-123"
  }
}
```

### GET /health
Check gateway status.

**Response:**
```json
{
  "status": "ok",
  "ospConnected": true,
  "timestamp": 1704067200000
}
```

## PHP Integration Example

```php
<?php
// Laravel Controller Example

use Illuminate\Support\Facades\Http;

class TodoController extends Controller
{
    private $gatewayUrl;

    public function __construct()
    {
        $this->gatewayUrl = env('OSP_GATEWAY_URL', 'http://localhost:3001');
    }

    public function create(Request $request)
    {
        $response = Http::post("{$this->gatewayUrl}/api/set", [
            'collection' => 'todos',
            'recordId' => $request->input('id'),
            'fields' => [
                'title' => $request->input('title'),
                'completed' => false,
                'userId' => $request->input('user_id'),
            ]
        ]);

        if ($response->successful()) {
            return response()->json([
                'success' => true,
                'message' => 'Todo created'
            ]);
        }

        return response()->json([
            'error' => 'Failed to create todo'
        ], 500);
    }

    public function delete($id)
    {
        $response = Http::delete("{$this->gatewayUrl}/api/delete", [
            'collection' => 'todos',
            'recordId' => $id
        ]);

        if ($response->successful()) {
            return response()->json([
                'success' => true,
                'message' => 'Todo deleted'
            ]);
        }

        return response()->json([
            'error' => 'Failed to delete todo'
        ], 500);
    }
}
```

## Authentication (Optional)

Gateway support JWT authentication untuk securing endpoints.

### Generate Token

**Request:**
```json
{
  "userId": "user-123",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### Use Token

```bash
curl -X POST http://localhost:3001/api/set \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"collection":"todos","recordId":"todo-123","fields":{"title":"Test"}}'
```

## Production Deployment

### 1. Set Strong JWT Secret

```env
JWT_SECRET=your-very-long-random-string-here
```

### 2. Restrict CORS

```env
CORS_ORIGIN=https://your-domain.com
```

### 3. Use Process Manager

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/gateway.js --name osp-gateway

# Monitor
pm2 monit
```

### 4. Nginx Reverse Proxy

```nginx
location /gateway/ {
    proxy_pass http://localhost:3001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Error Handling

Gateway akan return error dalam format:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing fields)
- `401` - Unauthorized (missing token)
- `403` - Forbidden (invalid token)
- `500` - Internal Server Error
- `503` - Service Unavailable (OSP not connected)

## Limitations

- Gateway tidak menyimpan state
- Subscriptions persist selama gateway running
- Real-time updates ke browser tetap via WebSocket (Browser SDK)
- Gateway hanya untuk backend-to-OSP communication

## Performance

- Latency: ~10-50ms per request
- Throughput: ~1000-5000 requests/second (depends on OSP server)
- Memory: ~50-100MB

## License

MIT
