<?php
/**
 * Create Order API Endpoint
 *
 * Frontend calls this via HTTP POST
 * PHP processes order, updates database, then updates OSP
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Validate input
$required = ['product_id', 'quantity', 'customer_name'];
foreach ($required as $field) {
    if (!isset($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing field: $field"]);
        exit;
    }
}

try {
    // 1. Business Logic - Validate stock
    $db = new PDO('sqlite:' . __DIR__ . '/../database/shop.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$input['product_id']]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        throw new Exception('Product not found');
    }

    if ($product['stock'] < $input['quantity']) {
        throw new Exception('Insufficient stock');
    }

    // 2. Create order in database
    $orderId = 'order_' . uniqid();
    $total = $product['price'] * $input['quantity'];

    $stmt = $db->prepare('
        INSERT INTO orders (id, product_id, quantity, total, customer_name, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $orderId,
        $input['product_id'],
        $input['quantity'],
        $total,
        $input['customer_name'],
        'pending',
        date('Y-m-d H:i:s')
    ]);

    // 3. Update stock
    $stmt = $db->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    $stmt->execute([$input['quantity'], $input['product_id']]);

    // 4. Update OSP (real-time sync ke semua clients)
    require_once __DIR__ . '/../vendor/autoload.php';

    $osp = new Owl\OSP\Client(
        host: 'localhost',
        port: 9420,
        token: 'backend-token'
    );

    // Update order in OSP
    $osp->set('orders', $orderId, [
        'id' => $orderId,
        'product_id' => $input['product_id'],
        'product_name' => $product['name'],
        'quantity' => $input['quantity'],
        'total' => $total,
        'customer_name' => $input['customer_name'],
        'status' => 'pending',
        'created_at' => date('Y-m-d H:i:s')
    ]);

    // Update product stock in OSP (so all clients see updated stock)
    $stmt = $db->prepare('SELECT stock FROM products WHERE id = ?');
    $stmt->execute([$input['product_id']]);
    $newStock = $stmt->fetchColumn();

    $osp->set('products', $input['product_id'], [
        'stock' => $newStock
    ]);

    $osp->disconnect();

    // 5. Return response
    echo json_encode([
        'success' => true,
        'order_id' => $orderId,
        'total' => $total,
        'message' => 'Order created successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
