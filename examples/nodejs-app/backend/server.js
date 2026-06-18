/**
 * HTTP Server
 *
 * Serves the frontend and provides REST API endpoints
 */

import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.HTTP_PORT || 3000;

// Middleware
app.use(express.json());

// Set correct MIME types for JavaScript files
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

app.use(express.static(join(__dirname, '../frontend')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API endpoint: Get all todos (from OSP via HTTP)
app.get('/api/todos', async (req, res) => {
  try {
    // In production, you'd fetch from OSP or database
    // For now, just return empty array
    res.json({ todos: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[Server] HTTP server running on http://localhost:${PORT}`);
  console.log(`[Server] Frontend: http://localhost:${PORT}/index.html`);
});
