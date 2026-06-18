<?php
/**
 * OSP Todo Backend Worker
 *
 * This worker listens for todo events from OSP server,
 * validates and processes them, then sends back confirmations.
 */

require_once __DIR__ . '/vendor/autoload.php';

use OWL\OSP\Client;
use Ramsey\Uuid\Uuid;

// Load config
$config = require __DIR__ . '/config.php';

// Simple JSON database
class JsonDatabase {
    private string $path;
    private array $data = [];

    public function __construct(string $path) {
        $this->path = $path;
        $this->load();
    }

    private function load(): void {
        if (file_exists($this->path)) {
            $this->data = json_decode(file_get_contents($this->path), true) ?? [];
        }
    }

    private function save(): void {
        file_put_contents($this->path, json_encode($this->data, JSON_PRETTY_PRINT));
    }

    public function get(string $id): ?array {
        return $this->data[$id] ?? null;
    }

    public function set(string $id, array $todo): void {
        $this->data[$id] = $todo;
        $this->save();
    }

    public function delete(string $id): void {
        unset($this->data[$id]);
        $this->save();
    }

    public function all(): array {
        return $this->data;
    }
}

// Todo service with business logic
class TodoService {
    private JsonDatabase $db;
    private array $config;

    public function __construct(JsonDatabase $db, array $config) {
        $this->db = $db;
        $this->config = $config;
    }

    /**
     * Validate and create/update todo
     */
    public function process(string $id, array $fields): array {
        // Validation
        if (isset($fields['title'])) {
            $title = trim($fields['title']);
            if (strlen($title) < $this->config['validation']['min_title_length']) {
                throw new Exception('Title too short');
            }
            if (strlen($title) > $this->config['validation']['max_title_length']) {
                throw new Exception('Title too long');
            }
            $fields['title'] = $title;
        }

        // Get existing or create new
        $todo = $this->db->get($id) ?? [
            'id' => $id,
            'created_at' => time()
        ];

        // Merge fields
        $todo = array_merge($todo, $fields);
        $todo['updated_at'] = time();

        // Save
        $this->db->set($id, $todo);

        return $todo;
    }

    /**
     * Delete todo
     */
    public function delete(string $id): void {
        $this->db->delete($id);
    }
}

// Main worker
class TodoWorker {
    private Client $client;
    private TodoService $service;
    private array $config;

    public function __construct(array $config) {
        $this->config = $config;

        // Initialize database
        $db = new JsonDatabase($config['database']['path']);

        // Initialize service
        $this->service = new TodoService($db, $config);

        // Initialize OSP client
        $this->client = new Client(
            $config['osp']['host'],
            $config['osp']['port'],
            $config['osp']['token']
        );
    }

    public function run(): void {
        echo "🚀 Starting Todo Worker...\n";
        echo "📡 Connecting to OSP server at {$this->config['osp']['host']}:{$this->config['osp']['port']}\n";

        // Connect to OSP
        $this->client->connect();
        echo "✅ Connected to OSP\n";

        // Subscribe to todos collection
        $collection = $this->config['osp']['collection'];
        $this->client->subscribe($collection);
        echo "👂 Subscribed to '{$collection}' collection\n";

        // Listen for events
        $this->client->on('patch', function($op) {
            if ($op->collection !== $this->config['osp']['collection']) {
                return;
            }

            echo "\n📨 Received PATCH for todo: {$op->recordId}\n";

            try {
                // Parse fields
                $fields = [];
                foreach ($op->fieldChanges as $fc) {
                    $fields[$fc->fieldName] = $fc->newValue;
                }

                echo "📝 Fields: " . json_encode($fields) . "\n";

                // Process todo
                $todo = $this->service->process($op->recordId, $fields);

                echo "✅ Processed successfully\n";

                // Send confirmation back
                $this->client->set($this->config['osp']['collection'], $op->recordId, [
                    'status' => 'confirmed',
                    'confirmed_at' => time()
                ]);

            } catch (Exception $e) {
                echo "❌ Error: {$e->getMessage()}\n";

                // Send error back
                $this->client->set($this->config['osp']['collection'], $op->recordId, [
                    'status' => 'error',
                    'error' => $e->getMessage()
                ]);
            }
        });

        $this->client->on('delete', function($op) {
            if ($op->collection !== $this->config['osp']['collection']) {
                return;
            }

            echo "\n🗑️  Received DELETE for todo: {$op->recordId}\n";

            try {
                $this->service->delete($op->recordId);
                echo "✅ Deleted successfully\n";

            } catch (Exception $e) {
                echo "❌ Error: {$e->getMessage()}\n";
            }
        });

        echo "\n🎯 Worker ready, waiting for events...\n";
        echo "Press Ctrl+C to stop\n\n";

        // Keep alive
        while ($this->client->isConnected()) {
            $this->client->poll();
            usleep(10000); // 10ms
        }

        echo "\n👋 Worker stopped\n";
    }
}

// Run worker
try {
    $worker = new TodoWorker($config);
    $worker->run();
} catch (Exception $e) {
    echo "❌ Fatal error: {$e->getMessage()}\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
