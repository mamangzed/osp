# Real-time Shop - Backend (PHP + Apache/NGINX)

Contoh aplikasi e-commerce sederhana dengan real-time sync menggunakan OSP.

## Arsitektur

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Browser   │ ─────────────────→ │ OSP Server  │
│  (Frontend) │ ←───────────────── │  (Rust)     │
└─────────────┘                    └─────────────┘
                                            ↑
                                            │ HTTP POST (business logic)
                                            │
                                     ┌─────────────┐
                                     │  PHP API    │
                                     │  (Apache)   │
                                     └─────────────┘
```

**Flow:**
1. Frontend connect ke OSP via WebSocket (real-time updates)
2. Frontend call PHP API via HTTP untuk business logic
3. PHP validate, save ke database, update OSP
4. OSP broadcast ke semua connected clients
5. Semua browser lihat update real-time!

## Setup

### 1. Install Dependencies

```bash
cd examples/web-app/backend
composer install
```

### 2. Initialize Database

```bash
php database/init.php
```

Ini akan buat SQLite database dengan sample products.

### 3. Start PHP Built-in Server (Development)

```bash
cd examples/web-app/backend
php -S localhost:8000
```

### 4. Production Setup (Apache/NGINX)

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

**NGINX:**
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
}
```

## API Endpoints

### GET /api/get_products.php
Load semua products dari database.

**Response:**
```json
{
    "success": true,
    "products": [
        {
            "id": "prod_1",
            "name": "Laptop",
            "price": 1200.00,
            "stock": 10
        }
    ]
}
```

### GET /api/get_orders.php
Load recent orders dari database.

**Response:**
```json
{
    "success": true,
    "orders": [
        {
            "id": "order_xxx",
            "product_id": "prod_1",
            "product_name": "Laptop",
            "quantity": 1,
            "total": 1200.00,
            "customer_name": "John Doe",
            "status": "pending",
            "created_at": "2026-06-17 10:30:00"
        }
    ]
}
```

### POST /api/create_order.php
Create new order.

**Request:**
```json
{
    "customer_name": "John Doe",
    "product_id": "prod_1",
    "quantity": 1
}
```

**Response:**
```json
{
    "success": true,
    "order_id": "order_xxx",
    "total": 1200.00,
    "message": "Order created successfully"
}
```

**Business Logic:**
1. Validate product exists
2. Check stock availability
3. Create order in database
4. Update stock in database
5. Update OSP (broadcast ke semua clients)

### POST /api/update_order_status.php
Update order status (admin/backend use).

**Request:**
```json
{
    "order_id": "order_xxx",
    "status": "shipped"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Order status updated"
}
```

**Valid Statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

## Real-time Updates

Frontend otomatis terima updates via OSP WebSocket:

### Products Collection
- Stock updates saat order dibuat
- Semua clients lihat stock real-time

### Orders Collection
- New orders muncul di semua clients
- Status updates broadcast ke semua clients
- Order details sync real-time

## Database Schema

### products
```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### orders
```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    total REAL NOT NULL,
    customer_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT "pending",
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## Testing

### Test 1: Real-time Stock Updates
1. Open 2 browser windows di `http://localhost:8080`
2. Create order di window 1
3. Lihat stock update real-time di window 2

### Test 2: Real-time Order Updates
1. Open 2 browser windows
2. Create order di window 1
3. Order muncul real-time di window 2
4. Update order status via API
5. Status update real-time di semua windows

### Test 3: Business Logic Validation
1. Try create order dengan quantity > stock
2. PHP API return error
3. Order tidak dibuat
4. OSP tidak di-update

## Security Notes

⚠️ **Production Checklist:**
- [ ] Add authentication (JWT/OAuth)
- [ ] Add rate limiting
- [ ] Sanitize all inputs
- [ ] Use prepared statements (already done)
- [ ] Enable HTTPS
- [ ] Set proper CORS headers
- [ ] Add CSRF protection
- [ ] Implement proper error handling
- [ ] Add logging
- [ ] Use environment variables for config

## Troubleshooting

### "Failed to connect to OSP"
- Check OSP server running: `ps aux | grep owl-server`
- Check WebSocket port: `netstat -tlnp | grep 9421`

### "Products not loading"
- Check PHP server running: `curl http://localhost:8000/api/get_products.php`
- Check database initialized: `ls -la database/shop.db`

### "Order not created"
- Check PHP error log
- Check database permissions
- Verify OSP SDK installed: `composer show | grep owl`

## License

MIT
