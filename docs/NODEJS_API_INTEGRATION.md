# Integrasi OSP dengan Node.js API dan Browser Frontend

Dokumen ini menjelaskan pola arsitektur di mana Node.js API (Express, Fastify, dll.) bertindak sebagai sumber data yang mendorong perubahan ke OSP, dan browser frontend menerima update secara real-time.

## Arsitektur

```text
[Browser Frontend] ←(WebSocket)→ [OSP Server] ←(TCP/WS)→ [Node.js API]
       │                               │                        │
       └── Subscribe 'todos'           │                        └── Push update via OSP
                                       │
                                       └── Fan-out otomatis ke semua subscriber
```

## 1. Setup Project

### Backend (Node.js API)
```bash
mkdir my-api && cd my-api
npm init -y
npm install express @owl/osp
npm install -D @types/express @types/node typescript
```

### Frontend (Browser)
```bash
# Jika pakai Vite/React/Vue
npm install @owl/osp-browser
```

---

## 2. Backend: Node.js API sebagai "Privileged Client"

Node.js API terhubung ke OSP Server sebagai client khusus dengan token rahasia. Saat ada perubahan data (dari REST endpoint, cron job, atau event eksternal), API memanggil `ospClient.set()` untuk memicu broadcast real-time.

**`src/server.ts`**
```typescript
import express from 'express';
import { OwlClient } from '@owl/osp';

const app = express();
app.use(express.json());

// 1. Inisialisasi OSP Client untuk API
const ospClient = new OwlClient({
  url: 'tcp://127.0.0.1:8080', // Atau 'ws://127.0.0.1:8081' jika pakai Node.js server
  token: 'api-secret-token',    // Token khusus untuk backend
  deviceId: 'nodejs-api-server'
});

// 2. Connect ke OSP Server saat startup
ospClient.connect().then(() => {
  console.log('✅ API terhubung ke OSP Server');
}).catch(err => {
  console.error('❌ Gagal connect ke OSP:', err);
});

// 3. REST Endpoint biasa
app.post('/api/todos', async (req, res) => {
  const { id, title } = req.body;

  // (Opsional) Simpan ke database tradisional dulu
  // await db.query('INSERT INTO todos (id, title) VALUES ($1, $2)', [id, title]);

  // 4. PUSH ke OSP -> Otomatis broadcast ke semua browser client!
  await ospClient.set('todos', id, 'title', title);
  await ospClient.set('todos', id, 'status', 'pending');

  res.json({ success: true, message: 'Todo created and broadcasted' });
});

app.patch('/api/todos/:id/complete', async (req, res) => {
  const { id } = req.params;

  // Update status di OSP
  await ospClient.set('todos', id, 'status', 'completed');

  res.json({ success: true });
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  // Tombstone record di OSP
  await ospClient.delete('todos', id);

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  ospClient.disconnect();
  process.exit(0);
});
```

---

## 3. Frontend: Browser Client Menerima Update Real-time

Browser terhubung via WebSocket, subscribe ke collection, dan listen event untuk update UI secara reaktif.

**`src/main.js` (Vanilla JS / bisa diadaptasi ke React/Vue)**
```javascript
import { OwlClient } from '@owl/osp-browser';

// 1. Inisialisasi Client
const client = new OwlClient({
  url: 'ws://127.0.0.1:8081', // URL WebSocket OSP Server / Bridge
  token: 'user-jwt-token',     // Token user (bisa berbeda dengan token API)
  deviceId: `browser-${Math.random().toString(36).substr(2, 9)}`
});

// 2. Setup event listener SEBELUM connect
client.onOpReceived = (op) => {
  console.log('📡 Real-time update dari server:', op);
  
  // Update state management (Redux, Zustand, Vue reactive, dll.)
  if (op.collection === 'todos') {
    updateTodoInUI(op.record_id, op.field_changes[0].field_name, op.field_changes[0].new_value);
  }
};

client.onDisconnected = () => {
  console.log('⚠️ Terputus dari OSP. Akan auto-reconnect...');
};

// 3. Connect
async function init() {
  try {
    await client.connect();
    console.log('✅ Terhubung ke OSP Server');

    // 4. Subscribe ke collection (dengan snapshot awal)
    await client.subscribe('todos', null, true);
    console.log('📌 Subscribed to todos');

    // Render data awal dari local cache
    renderTodos();
  } catch (err) {
    console.error('❌ Gagal connect:', err);
  }
}

function updateTodoInUI(recordId, field, value) {
  // Logika update UI framework Anda di sini
  console.log(`UI Update: todo ${recordId} field ${field} = ${value}`);
  renderTodos();
}

function renderTodos() {
  // Ambil data dari local cache OSP (offline-first!)
  // Catatan: Di implementasi nyata, Anda perlu iterate semua record di collection
  const todo1 = client.get('todos', 'todo-1');
  if (todo1) {
    console.log('Current todo-1:', todo1.fields);
  }
}

init();
```

---

## 4. Skenario: Frontend Update, Backend Sync ke Database

Jika Anda ingin browser client melakukan update langsung (offline-first), dan backend hanya listen untuk sync ke database utama:

**Backend Listener (`src/sync-listener.ts`)**
```typescript
import { OwlClient } from '@owl/osp';

const ospClient = new OwlClient({
  url: 'tcp://127.0.0.1:8080',
  token: 'api-secret-token',
  deviceId: 'nodejs-db-syncer'
});

await ospClient.connect();

// Subscribe ke semua perubahan di 'todos'
await ospClient.subscribe('todos', null, false); // false = tidak perlu snapshot awal

ospClient.onOpReceived = async (op) => {
  console.log('🔄 Browser melakukan perubahan, sync ke database...');

  if (op.kind === 2) { // Update
    const change = op.field_changes[0];
    await db.query(
      `UPDATE todos SET ${change.field_name} = $1 WHERE id = $2`,
      [change.new_value, op.record_id]
    );
  } else if (op.kind === 3) { // Delete (Tombstone)
    await db.query(`UPDATE todos SET deleted_at = NOW() WHERE id = $1`, [op.record_id]);
  } else if (op.kind === 4) { // Restore
    await db.query(`UPDATE todos SET deleted_at = NULL WHERE id = $1`, [op.record_id]);
  }
};
```

---

## 5. Keunggulan Pola Ini

| Fitur | Manfaat |
|-------|---------|
| **Real-time Gratis** | Tidak perlu setup Redis Pub/Sub, Socket.io, atau GraphQL subscriptions manual. OSP handle fan-out. |
| **Offline-first** | Browser bisa tetap berfungsi saat network putus. Mutasi di-queue lokal dan auto-replay saat online. |
| **Conflict Resolution** | Jika 2 user edit data sama bersamaan, OSP LWW (Last-Write-Wins) resolve otomatis sebelum sampai ke backend. |
| **Decoupled** | Node.js API tidak perlu tahu soal WebSocket connection management. Cukup panggil `ospClient.set()`. |
| **Single Source of Truth** | OSP Server menyimpan state terbaru + vector clock, mencegah race condition. |

---

## 6. Deployment Checklist

- [ ] Jalankan OSP Server (Rust atau Node.js) di production dengan TLS.
- [ ] Gunakan token JWT yang berbeda untuk API backend dan user frontend.
- [ ] Setup monitoring untuk OSP Server (active connections, ops/sec).
- [ ] Jika pakai Rust OSP Server, deploy `owl-ws-bridge` di depan untuk support browser client.
- [ ] Pastikan firewall mengizinkan port OSP (biasanya 8080 untuk TCP, 8081 untuk WS).

---

## 7. Troubleshooting

**Browser tidak menerima update:**
1. Pastikan `client.subscribe()` dipanggil setelah `client.connect()`.
2. Cek di browser console apakah `onOpReceived` ter-trigger.
3. Pastikan token yang dipakai frontend memiliki scope untuk collection tersebut.

**API gagal connect ke OSP:**
1. Pastikan OSP Server sudah running (`curl -v tcp://127.0.0.1:8080` atau cek log).
2. Pastikan `deviceId` API unik dan tidak bentrok dengan deviceId client lain.

**Data tidak persist di database:**
- Ingat: OSP default-nya **in-memory**. Jika Anda ingin data persist, Anda HARUS menambahkan logika sync ke database di backend (seperti contoh "Frontend Update, Backend Sync" di atas), atau extend `SyncEngine` untuk persist ke SQLite/PostgreSQL.
