/**
 * Long-running Backend Worker
 *
 * This worker:
 * 1. Connects to OSP server
 * 2. Subscribes to collections
 * 3. Processes incoming operations
 * 4. Applies business logic
 * 5. Updates OSP with results
 */

import dotenv from 'dotenv';
import { OspClient } from './osp-client.js';

dotenv.config();

// Simple in-memory database (use Redis/PostgreSQL in production)
const db = {
  todos: new Map(),
  counters: new Map()
};

// Initialize OSP client
const osp = new OspClient(
  process.env.OSP_HOST || 'localhost',
  process.env.OSP_WS_PORT || 9421,
  process.env.OSP_TOKEN || 'your-secret-token'
);

// Business logic handlers
const handlers = {
  // Create or update a todo
  async handleTodoUpdate(collection, recordId, fields) {
    console.log(`[Worker] Processing todo update: ${recordId}`);

    // Validation
    if (fields.title && fields.title.length < 3) {
      throw new Error('Title too short (minimum 3 characters)');
    }

    if (fields.title && fields.title.length > 200) {
      throw new Error('Title too long (maximum 200 characters)');
    }

    // Get existing or create new
    const todo = db.todos.get(recordId) || {
      id: recordId,
      createdAt: Date.now(),
      status: 'pending'
    };

    // Merge fields
    Object.assign(todo, fields);
    todo.updatedAt = Date.now();

    // Save to database
    db.todos.set(recordId, todo);

    console.log(`[Worker] Todo saved:`, todo);

    // Update OSP with processed status
    await osp.set(collection, recordId, {
      status: 'confirmed',
      processedAt: Date.now()
    });

    return todo;
  },

  // Delete a todo
  async handleTodoDelete(collection, recordId) {
    console.log(`[Worker] Processing todo delete: ${recordId}`);

    if (!db.todos.has(recordId)) {
      throw new Error('Todo not found');
    }

    db.todos.delete(recordId);

    console.log(`[Worker] Todo deleted: ${recordId}`);

    // No need to update OSP, the delete will be broadcasted
  },

  // Increment a counter (demonstrates atomic operations)
  async handleCounterIncrement(collection, recordId, fields) {
    console.log(`[Worker] Processing counter increment: ${recordId}`);

    const increment = fields.increment || 1;
    const current = db.counters.get(recordId) || 0;
    const newValue = current + increment;

    db.counters.set(recordId, newValue);

    console.log(`[Worker] Counter ${recordId}: ${current} → ${newValue}`);

    // Update OSP with new value
    await osp.set(collection, recordId, {
      value: newValue,
      updatedAt: Date.now()
    });

    return { value: newValue };
  }
};

// Event handlers
osp.on('patch', async (data) => {
  const { collection, recordId, fields } = data;

  console.log(`[Worker] Received PATCH: ${collection}/${recordId}`);

  try {
    let result;

    // Route to appropriate handler
    if (collection === 'todos') {
      result = await handlers.handleTodoUpdate(collection, recordId, fields);
    } else if (collection === 'counters') {
      result = await handlers.handleCounterIncrement(collection, recordId, fields);
    } else {
      console.log(`[Worker] Unknown collection: ${collection}`);
      return;
    }

    console.log(`[Worker] Processed successfully:`, result);

  } catch (error) {
    console.error(`[Worker] Error processing ${collection}/${recordId}:`, error.message);

    // Send error back to OSP
    await osp.set(collection, recordId, {
      error: error.message,
      status: 'error'
    });
  }
});

osp.on('delete', async (data) => {
  const { collection, recordId } = data;

  console.log(`[Worker] Received DELETE: ${collection}/${recordId}`);

  try {
    if (collection === 'todos') {
      await handlers.handleTodoDelete(collection, recordId);
    } else {
      console.log(`[Worker] Unknown collection: ${collection}`);
    }

  } catch (error) {
    console.error(`[Worker] Error processing delete:`, error.message);
  }
});

// Periodic tasks (demonstrates background jobs)
setInterval(async () => {
  if (!osp.isConnected()) return;

  // Example: Sync database stats to OSP every 10 seconds
  const stats = {
    totalTodos: db.todos.size,
    totalCounters: db.counters.size,
    updatedAt: Date.now()
  };

  try {
    await osp.set('stats', 'worker', stats);
  } catch (error) {
    console.error('[Worker] Failed to update stats:', error.message);
  }
}, 10000);

// Main function
async function main() {
  console.log('[Worker] Starting Node.js OSP Worker...');
  console.log('[Worker] OSP Server:', process.env.OSP_HOST || 'localhost');
  console.log('[Worker] OSP Port:', process.env.OSP_WS_PORT || 9421);

  try {
    // Connect to OSP
    await osp.connect();
    console.log('[Worker] Connected to OSP server');

    // Subscribe to collections
    await osp.subscribe('todos');
    await osp.subscribe('counters');
    console.log('[Worker] Subscribed to collections: todos, counters');

    // Send initial stats
    await osp.set('stats', 'worker', {
      totalTodos: 0,
      totalCounters: 0,
      startedAt: Date.now()
    });

    console.log('[Worker] Ready and waiting for events...');

  } catch (error) {
    console.error('[Worker] Failed to start:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Worker] Shutting down...');
  osp.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('[Worker] Received SIGTERM, shutting down...');
  osp.disconnect();
  process.exit(0);
});

// Start the worker
main();
