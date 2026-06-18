<?php
/**
 * Update Order Status API Endpoint
 *
 * Admin/Backend calls this to update order status
 * PHP validates, updates database, then broadcasts to OSP
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['order_id']) || !isset($input['status'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing order_id or status']);
    exit;
}

// Validate status
$validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
if (!in_array($input['status'], $validStatuses)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid status']);
    exit;
}

try {
    // 1. Update database
    $db = new PDO('sqlite:' . __DIR__ . '/../database/shop.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
    $stmt->execute([$input['status'], $input['order_id']]);

    if ($stmt->rowCount() === 0) {
        throw new Exception('Order not found');
    }

    // 2. Broadcast to OSP (all connected clients will see update)
    require_once __DIR__ . '/../vendor/autoload.php';

    $osp = new Owl\OSP\Client(
        host: 'localhost',
        port: 9420,
        token: 'backend-token'
    );

    $osp->set('orders', $input['order_id'], [
        'status' => $input['status'],
        'updated_at' => date('Y-m-d H:i:s')
    ]);

    $osp->disconnect();

    echo json_encode([
        'success' => true,
        'message' => 'Order status updated'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
