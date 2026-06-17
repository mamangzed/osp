/**
 * Contoh: Node.js API (Express) yang terintegrasi dengan OSP
 *
 * Jalankan:
 * 1. Pastikan OSP Server running di tcp://127.0.0.1:8080
 * 2. npm install express @types/express
 * 3. npx ts-node api-server.ts
 */

import express from 'express';
import { OwlClient } from '../src/index';

const app = express();
app.use(express.json());

// 1. Inisialisasi OSP Client untuk API
const ospClient = new OwlClient({
  url: 'tcp://127.0.0.1:8080', // Ganti ke 'ws://127.0.0.1:8081' jika pakai Node.js server
  token: 'api-secret-token',
  deviceId: 'nodejs-api-server'
});

// 2. Connect ke OSP Server saat startup
ospClient.connect().then(() => {
  console.log('✅ API terhubung ke OSP Server');
}).catch(err => {
  console.error('❌ Gagal connect ke OSP:', err);
  process.exit(1);
});

// 3. REST Endpoints
app.post('/api/todos', async (req, res) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'id and title required' });
  }

  try {
    // (Opsional) Simpan ke database tradisional di sini
    // await db.query('INSERT INTO todos (id, title) VALUES ($1, $2)', [id, title]);

    // PUSH ke OSP -> Otomatis broadcast ke semua browser client!
    await ospClient.set('todos', id, 'title', title);
    await ospClient.set('todos', id, 'status', 'pending');

    res.json({ success: true, message: 'Todo created and broadcasted' });
  } catch (err) {
    console.error('Error pushing to OSP:', err);
    res.status(500).json({ error: 'Failed to broadcast' });
  }
});

app.patch('/api/todos/:id/complete', async (req, res) => {
  const { id } = req.params;

  try {
    await ospClient.set('todos', id, 'status', 'completed');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await ospClient.delete('todos', id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    ospConnected: ospClient.is_connected?.() || true
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  ospClient.disconnect();
  process.exit(0);
});
