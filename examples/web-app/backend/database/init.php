<?php
/**
 * Initialize Database
 *
 * Run this once to create tables and sample data
 */

$dbPath = __DIR__ . '/shop.db';

// Delete existing database
if (file_exists($dbPath)) {
    unlink($dbPath);
    echo "Deleted existing database\n";
}

$db = new PDO('sqlite:' . $dbPath);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "Creating tables...\n";

// Create products table
$db->exec('
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
');

// Create orders table
$db->exec('
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        total REAL NOT NULL,
        customer_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT "pending",
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
');

echo "Inserting sample products...\n";

// Insert sample products
$stmt = $db->prepare('INSERT INTO products (id, name, price, stock) VALUES (?, ?, ?, ?)');

$products = [
    ['prod_1', 'Laptop', 1200.00, 10],
    ['prod_2', 'Mouse', 25.00, 50],
    ['prod_3', 'Keyboard', 75.00, 30],
    ['prod_4', 'Monitor', 300.00, 15],
    ['prod_5', 'Headphones', 80.00, 40],
];

foreach ($products as $product) {
    $stmt->execute($product);
}

echo "Database initialized successfully!\n";
echo "Database path: $dbPath\n";
