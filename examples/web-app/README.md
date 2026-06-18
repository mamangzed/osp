# Real-time Shop - OSP Example App

Contoh lengkap aplikasi e-commerce dengan real-time sync menggunakan OSP.

## 🎯 Demo Fitur

✅ **Real-time Product Stock** - Semua clients lihat stock update instantly  
✅ **Real-time Orders** - New orders muncul di semua browsers  
✅ **Real-time Status Updates** - Order status sync ke semua clients  
✅ **Business Logic in PHP** - Validation, database, security di backend  
✅ **Apache/NGINX Compatible** - No special PHP setup needed

## 🏗️ Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Browser   │ ─────────────────→ │ OSP Server  │
│  (Frontend) │ ←───────────────── │  (Rust)     │
└─────────────┘                    └─────────────┘
                                            ↑
                                            │ HTTP POST
                                            │
                                     ┌─────────────┐
                                     │  PHP API    │
                                     │  (Apache)   │
                                     └─────────────┘
                                            │
                                            │ SQLite
                                            ↓
                                     ┌─────────────┐
                                     │  Database   │
                                     └─────────────┘
```

**How it works:**
1. Frontend connects ke OSP via WebSocket (real-time channel)
2. User action (e.g. create order) → Frontend calls PHP API via HTTP
3. PHP processes business logic, updates database, updates OSP
4. OSP broadcasts update ke semua connected clients
5. Semua browsers lihat update real-time!

## 🚀 Quick Start

### 1. Start OSP Server

```bash
# Dari root project
cargo run --release --bin owl-server -- \
  --bind 0.0.0.0:9420 \
  --ws-bind 0.0.0.0:9421
```

### 2. Setup Backend

```bash
cd examples/web-app/backend

# Install PHP dependencies
composer install

# Initialize database
php database/init.php

# Start PHP server
php -S localhost:8000
```

### 3. Open Frontend

Open `examples/web-app/frontend/index.html` di browser, atau:

```bash
cd examples/web-app/frontend
python3 -m http.server 8080
```

Lalu buka: `http://localhost:8080`

### 4. Test Real-time Sync

1. Open page di 2 browser windows
2. Create order di window 1
3. Lihat order muncul real-time di window 2!
4. Lihat stock update real-time di kedua windows!

## 📁 Project Structure

```
examples/web-app/
├── frontend/
│   ├── index.html          # UI dengan product list & orders
│   ├── app.js              # Frontend logic
│   ├── osp-client.js       # OSP WebSocket client
│   └── style.css           # Styling
│
└── backend/
    ├── api/
    │   ├── get_products.php       # Load products
    │   ├── get_orders.php         # Load orders
    │   ├── create_order.php       # Create order (business logic)
    │   └── update_order_status.php # Update status
    │
    ├── database/
    │   ├── init.php               # Initialize database
    │   └── shop.db                # SQLite database (auto-created)
    │
    ├── vendor/                    # Composer dependencies
    ├── composer.json
    └── README.md
```

## 🎮 Try These Scenarios

### Scenario 1: Real-time Stock
1. Open 2 browser windows
2. Window 1: Create order untuk "Laptop" (stock: 10)
3. Window 2: Lihat stock update dari 10 → 9 instantly
4. Both windows sekarang show stock: 9

### Scenario 2: Real-time Orders
1. Open 2 browser windows
2. Window 1: Create new order
3. Window 2: Order muncul di "Recent Orders" instantly
4. No refresh needed!

### Scenario 3: Business Logic Validation
1. Try create order dengan quantity = 100 (lebih dari stock)
2. PHP API validates: "Insufficient stock"
3. Order tidak dibuat
4. OSP tidak di-update
5. Stock tetap sama

### Scenario 4: Order Status Updates
```bash
# Update order status via API
curl -X POST http://localhost:8000/api/update_order_status.php \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "order_xxx",
    "status": "shipped"
  }'
```

Lihat status update real-time di semua browsers!

## 🔧 Tech Stack

**Frontend:**
- Vanilla JavaScript (no framework)
- OSP WebSocket Client
- Modern CSS with animations

**Backend:**
- PHP 8.0+
- SQLite database
- Apache/NGINX compatible
- OSP PHP SDK

**Real-time:**
- OSP Server (Rust)
- WebSocket for browsers
- TCP for PHP backend

## 📊 API Endpoints

### GET /api/get_products.php
Load semua products.

### GET /api/get_orders.php
Load recent orders.

### POST /api/create_order.php
Create new order.

**Request:**
```json
{
    "customer_name": "John Doe",
    "product_id": "prod_1",
    "quantity": 2
}
```

**Response:**
```json
{
    "success": true,
    "order_id": "order_xxx",
    "total": 2400.00
}
```

### POST /api/update_order_status.php
Update order status.

**Request:**
```json
{
    "order_id": "order_xxx",
    "status": "shipped"
}
```

## 🛡️ Why This Architecture?

### ✅ Advantages

1. **PHP stays simple** - Request-response, no long-running processes
2. **Apache/NGINX compatible** - Works with existing hosting
3. **Business logic in PHP** - Validation, security, database di backend
4. **Real-time updates** - OSP handles WebSocket connections
5. **Scalable** - Multiple PHP servers can update same OSP collections
6. **No special setup** - Standard PHP hosting works

### 🔄 Comparison with Worker Pattern

| Aspect | Worker Pattern | HTTP API Pattern (This) |
|--------|---------------|------------------------|
| PHP Setup | Long-running process | Standard Apache/NGINX |
| Hosting | VPS/Dedicated | Shared hosting OK |
| Business Logic | In worker | In API endpoints |
| Real-time | Direct OSP | Via API → OSP |
| Complexity | Higher | Lower |
| Scalability | Manual | Automatic (load balancer) |

## 🎓 Learning Points

1. **Separation of Concerns**
   - Frontend: UI + real-time updates
   - PHP API: Business logic + database
   - OSP: Real-time sync layer

2. **Real-time without Complexity**
   - No need for WebSockets di PHP
   - No need for long-running processes
   - Standard HTTP requests work fine

3. **Database as Source of Truth**
   - PHP writes to database
   - PHP updates OSP for real-time
   - Frontend loads initial data from API
   - Frontend gets updates from OSP

## 🚨 Production Checklist

- [ ] Add authentication (JWT/OAuth)
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Sanitize all inputs
- [ ] Add CSRF protection
- [ ] Implement proper error handling
- [ ] Add logging
- [ ] Use environment variables
- [ ] Setup database backups
- [ ] Add monitoring
- [ ] Configure CORS properly

## 📚 Next Steps

1. **Add Authentication** - JWT tokens, OAuth
2. **Add Categories** - Organize products
3. **Add Search** - Find products quickly
4. **Add Pagination** - Handle large datasets
5. **Add Images** - Product photos
6. **Add Reviews** - Customer feedback
7. **Add Analytics** - Track sales, popular products
8. **Add Notifications** - Email/SMS on order status

## 🆘 Troubleshooting

### "WebSocket connection failed"
- Check OSP server running on port 9421
- Check browser console for errors

### "Products not loading"
- Check PHP server running on port 8000
- Run `php database/init.php` to create database

### "Order creation failed"
- Check PHP error logs
- Verify database permissions
- Check OSP server connection from PHP

### "No real-time updates"
- Check browser connected to WebSocket
- Check OSP server logs
- Verify PHP updates OSP after creating order

## 📖 Documentation

- [OSP Documentation](../../../docs/)
- [PHP SDK Documentation](../../../sdk/php/)
- [Protocol Specification](../../../PROTOCOL.md)

## 🤝 Contributing

Feel free to improve this example! Some ideas:
- Add more products
- Improve UI/UX
- Add more API endpoints
- Add tests
- Improve documentation

## 📄 License

MIT
