# JWT Authentication Guide

## Overview

OSP supports JWT (JSON Web Token) authentication for secure client connections. JWT tokens are signed using HS256 (HMAC with SHA-256) algorithm.

## Generating JWT Tokens

### Using CLI

```bash
# Generate a token with default settings (1 day expiry, all scopes)
cargo run --bin owl -- issue-token --secret "your-secret-key"

# Generate a token with custom device ID
cargo run --bin owl -- issue-token \
  --secret "your-secret-key" \
  --device "550e8400-e29b-41d4-a716-446655440000"

# Generate a token with specific scopes
cargo run --bin owl -- issue-token \
  --secret "your-secret-key" \
  --scopes "users,orders,products"

# Generate a token with custom TTL (in seconds)
cargo run --bin owl -- issue-token \
  --secret "your-secret-key" \
  --ttl 3600  # 1 hour
```

### Token Structure

The JWT token contains the following claims:

```json
{
  "sub": "device-uuid",
  "exp": 1704067200,
  "iat": 1703980800,
  "collection_scopes": ["users", "orders"]
}
```

- `sub`: Device UUID (subject)
- `exp`: Expiration timestamp (Unix timestamp)
- `iat`: Issued at timestamp (Unix timestamp)
- `collection_scopes`: Array of collection names the device can access

## Server Configuration

### Enable JWT Authentication

Start the server with `--jwt-secret` flag:

```bash
# TCP only
cargo run --bin owl-server -- \
  --bind 0.0.0.0:9420 \
  --db owl.db \
  --jwt-secret "your-secret-key"

# TCP + WebSocket
cargo run --bin owl-server -- \
  --bind 0.0.0.0:9420 \
  --ws-bind 0.0.0.0:9421 \
  --db owl.db \
  --jwt-secret "your-secret-key"
```

### Development Mode (No JWT)

If `--jwt-secret` is not provided, the server runs in development mode and accepts any non-empty token with all scopes:

```bash
cargo run --bin owl-server -- --bind 0.0.0.0:9420 --db owl.db
```

**⚠️ Warning**: Never use development mode in production!

## Client Usage

### Node.js SDK

```javascript
const { OSPClient } = require('@owl/osp-sdk');

const client = new OSPClient({
  host: 'localhost',
  port: 9420,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // JWT token
});

await client.connect();
```

### Browser SDK

```javascript
const osp = new OSP.OSPBrowserClient({
  url: 'ws://localhost:9421',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // JWT token
});

await osp.connect();
```

### PHP SDK

```php
use OWL\OSP\Client;

$client = new Client(
    'localhost',
    9420,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // JWT token
);

$client->connect();
```

### Flutter SDK

```dart
final client = OspClient(
  serverUrl: 'localhost',
  port: 9420,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // JWT token
);

await client.connect();
```

## HTTP Gateway Authentication

The HTTP Gateway also supports JWT authentication for securing API endpoints.

### Generate Gateway Token

```bash
curl -X POST http://localhost:3001/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123", "role": "admin"}'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### Use Gateway Token

```bash
curl -X POST http://localhost:3001/api/set \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"collection": "todos", "recordId": "todo-123", "fields": {"title": "Test"}}'
```

## Token Validation Flow

1. Client sends AUTH frame with JWT token
2. Server validates JWT signature using the secret key
3. Server checks token expiration
4. Server extracts device_id and collection_scopes from claims
5. Server sends AUTH_OK with device_id and scopes
6. Client can now access collections based on scopes

## Error Handling

### Invalid Token

If the token is invalid (bad signature, malformed, etc.):

```
AuthFailed {
  code: 403,
  message: "Invalid token: ..."
}
```

### Expired Token

If the token has expired:

```
AuthFailed {
  code: 401,
  message: "Token expired"
}
```

### Missing Scope

If the client tries to access a collection not in their scopes:

```
SubscribeAck {
  accepted: false,
  error: {
    code: 403,
    message: "missing scope"
  }
}
```

## Security Best Practices

### 1. Use Strong Secrets

```bash
# Generate a strong random secret
openssl rand -base64 32
```

### 2. Set Appropriate TTL

- Short-lived tokens (1-24 hours) for web/mobile clients
- Longer tokens (7-30 days) for backend services
- Use refresh tokens for long-lived sessions

### 3. Scope Limitation

Grant minimum required scopes:

```bash
# Good: Limited scopes
cargo run --bin owl -- issue-token \
  --secret "your-secret-key" \
  --scopes "users,orders"

# Bad: Wildcard scope (unless necessary)
cargo run --bin owl -- issue-token \
  --secret "your-secret-key" \
  --scopes "*"
```

### 4. Secure Secret Storage

- Never commit secrets to version control
- Use environment variables or secret management systems
- Rotate secrets periodically

### 5. HTTPS/TLS in Production

Always use TLS encryption in production:

```bash
# Server with TLS
cargo run --bin owl-server -- \
  --bind 0.0.0.0:9420 \
  --ws-bind 0.0.0.0:9421 \
  --db owl.db \
  --jwt-secret "your-secret-key"
```

## Token Refresh Strategy

### Option 1: Short-lived Tokens

Issue short-lived tokens (e.g., 1 hour) and require clients to re-authenticate:

```bash
cargo run --bin owl -- issue-token \
  --secret "your-secret-key" \
  --ttl 3600  # 1 hour
```

### Option 2: Token Refresh Endpoint

Implement a token refresh endpoint in your backend:

```javascript
// Backend API
app.post('/api/auth/refresh', (req, res) => {
  const { currentToken } = req.body;
  
  // Validate current token
  const claims = validateToken(currentToken);
  if (!claims) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Issue new token
  const newToken = generateToken(claims.device_id, claims.scopes);
  res.json({ token: newToken });
});
```

### Option 3: Gateway Token Refresh

Use the HTTP Gateway's token endpoint:

```javascript
// Client-side
async function refreshToken() {
  const response = await fetch('http://localhost:3001/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'user-123' })
  });
  
  const { token } = await response.json();
  localStorage.setItem('osp_token', token);
}

// Refresh before expiry
setInterval(refreshToken, 3600000); // Every hour
```

## Troubleshooting

### "Invalid token" Error

1. Check if the secret key matches between token generation and server
2. Verify the token is not corrupted or truncated
3. Check token format (should be valid JWT)

### "Token expired" Error

1. Check server time is correct (NTP sync)
2. Increase TTL when generating tokens
3. Implement token refresh mechanism

### "Missing scope" Error

1. Check token scopes include the collection you're accessing
2. Regenerate token with required scopes:
   ```bash
   cargo run --bin owl -- issue-token \
     --secret "your-secret-key" \
     --scopes "users,orders,products"
   ```

## Example: Complete Authentication Flow

```bash
# 1. Generate a token
TOKEN=$(cargo run --bin owl -- issue-token \
  --secret "my-secret-key" \
  --device "device-123" \
  --scopes "users,orders" \
  --ttl 86400)

echo "Token: $TOKEN"

# 2. Start server with JWT authentication
cargo run --bin owl-server -- \
  --bind 0.0.0.0:9420 \
  --db owl.db \
  --jwt-secret "my-secret-key"

# 3. Connect client with token
cargo run --bin owl -- client \
  --url tcp://127.0.0.1:9420 \
  --token "$TOKEN" \
  get users user-1
```

## Additional Resources

- [JWT.io](https://jwt.io) - JWT debugger and documentation
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT specification
- [HS256 Algorithm](https://en.wikipedia.org/wiki/HMAC) - HMAC-SHA256 algorithm
