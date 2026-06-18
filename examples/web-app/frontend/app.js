/**
 * Shop Frontend - Real-time with OSP
 *
 * Architecture:
 * - Frontend connects to OSP via WebSocket (real-time updates)
 * - Frontend calls PHP API via HTTP (business logic)
 * - PHP updates database + OSP
 * - OSP broadcasts to all clients
 */

class ShopApp {
    constructor() {
        this.ospClient = null;
        this.products = new Map();
        this.orders = new Map();

        this.init();
    }

    async init() {
        // Load initial data from PHP API
        await this.loadProducts();
        await this.loadOrders();

        // Connect to OSP for real-time updates
        await this.connectToOSP();

        // Setup event listeners
        this.setupEventListeners();
    }

    async loadProducts() {
        try {
            const response = await fetch('http://localhost:8000/api/get_products.php');
            const data = await response.json();

            if (data.success) {
                data.products.forEach(product => {
                    this.products.set(product.id, product);
                });
                this.renderProducts();
                this.renderProductSelect();
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    async loadOrders() {
        try {
            const response = await fetch('http://localhost:8000/api/get_orders.php');
            const data = await response.json();

            if (data.success) {
                data.orders.forEach(order => {
                    this.orders.set(order.id, order);
                });
                this.renderOrders();
            }
        } catch (error) {
            console.error('Failed to load orders:', error);
        }
    }

    async connectToOSP() {
        try {
            // Connect to OSP WebSocket
            this.ospClient = new OspClient('ws://localhost:9421', 'frontend-token');

            await this.ospClient.connect();
            this.updateStatus('Connected to OSP', 'connected');

            // Subscribe to collections
            await this.ospClient.subscribe('products');
            await this.ospClient.subscribe('orders');

            // Listen for real-time updates
            this.ospClient.on('patch', (data) => {
                console.log('📨 Received update:', data);
                this.handleUpdate(data);
            });

        } catch (error) {
            console.error('Failed to connect to OSP:', error);
            this.updateStatus('Failed to connect to OSP', 'error');
        }
    }

    handleUpdate(data) {
        const { collection, recordId, fields } = data;

        if (collection === 'products') {
            // Update product
            const product = this.products.get(recordId) || {};
            this.products.set(recordId, { ...product, ...fields });
            this.renderProducts();

            // Flash update
            setTimeout(() => {
                const el = document.querySelector(`[data-product-id="${recordId}"]`);
                if (el) {
                    el.classList.add('update-flash');
                    setTimeout(() => el.classList.remove('update-flash'), 500);
                }
            }, 100);

        } else if (collection === 'orders') {
            // Update order
            const order = this.orders.get(recordId) || {};
            this.orders.set(recordId, { ...order, ...fields });
            this.renderOrders();

            // Flash update
            setTimeout(() => {
                const el = document.querySelector(`[data-order-id="${recordId}"]`);
                if (el) {
                    el.classList.add('update-flash');
                    setTimeout(() => el.classList.remove('update-flash'), 500);
                }
            }, 100);
        }
    }

    setupEventListeners() {
        document.getElementById('orderForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createOrder();
        });
    }

    async createOrder() {
        const customerName = document.getElementById('customerName').value;
        const productId = document.getElementById('productId').value;
        const quantity = parseInt(document.getElementById('quantity').value);

        const resultDiv = document.getElementById('orderResult');
        resultDiv.innerHTML = '<div style="color: #666;">Creating order...</div>';

        try {
            // Call PHP API (business logic)
            const response = await fetch('http://localhost:8000/api/create_order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer_name: customerName,
                    product_id: productId,
                    quantity: quantity
                })
            });

            const data = await response.json();

            if (data.success) {
                resultDiv.innerHTML = `
                    <div style="background: #d4edda; color: #155724; padding: 10px; border-radius: 6px;">
                        ✅ Order created successfully! Order ID: ${data.order_id}
                    </div>
                `;

                // Clear form
                document.getElementById('orderForm').reset();

            } else {
                throw new Error(data.error || 'Failed to create order');
            }

        } catch (error) {
            console.error('Failed to create order:', error);
            resultDiv.innerHTML = `
                <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 6px;">
                    ❌ ${error.message}
                </div>
            `;
        }
    }

    renderProducts() {
        const container = document.getElementById('productsList');

        if (this.products.size === 0) {
            container.innerHTML = '<div class="empty-state">No products available</div>';
            return;
        }

        const productsHTML = Array.from(this.products.values()).map(product => {
            const stockClass = product.stock < 10 ? 'low' : product.stock < 30 ? 'medium' : 'high';
            const stockText = product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`;

            return `
                <div class="product" data-product-id="${product.id}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="stock ${stockClass}">${stockText}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = productsHTML;
    }

    renderProductSelect() {
        const select = document.getElementById('productId');
        select.innerHTML = '<option value="">Select Product</option>';

        this.products.forEach(product => {
            if (product.stock > 0) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - $${product.price.toFixed(2)} (${product.stock} available)`;
                select.appendChild(option);
            }
        });
    }

    renderOrders() {
        const container = document.getElementById('ordersList');

        if (this.orders.size === 0) {
            container.innerHTML = '<div class="empty-state">No orders yet</div>';
            return;
        }

        const ordersHTML = Array.from(this.orders.values())
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10)
            .map(order => {
                return `
                    <div class="order" data-order-id="${order.id}">
                        <div class="order-header">
                            <span class="order-id">${order.id}</span>
                            <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
                        </div>
                        <div class="order-details">
                            <div><strong>${order.product_name}</strong> × ${order.quantity}</div>
                            <div>Total: $${order.total.toFixed(2)}</div>
                            <div>Customer: ${order.customer_name}</div>
                            <div style="font-size: 12px; color: #999;">${order.created_at}</div>
                        </div>
                    </div>
                `;
            }).join('');

        container.innerHTML = ordersHTML;
    }

    updateStatus(text, className) {
        const statusBar = document.getElementById('statusBar');
        statusBar.textContent = text;
        statusBar.className = 'status-bar ' + className;
    }
}

// Initialize app
const app = new ShopApp();
