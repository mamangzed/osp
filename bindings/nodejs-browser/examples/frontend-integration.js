/**
 * Contoh: Frontend Browser yang menerima update real-time dari OSP
 *
 * Gunakan dengan Vite/Webpack, atau include via <script type="module">
 *
 * import { initOspClient } from './frontend-integration.js';
 * initOspClient('ws://127.0.0.1:8081', 'user-jwt-token');
 */

import { OwlClient } from '../src/index';

let client = null;

export async function initOspClient(wsUrl, token) {
  if (client) {
    console.warn('OSP Client sudah diinisialisasi');
    return client;
  }

  client = new OwlClient({
    url: wsUrl,
    token: token,
    deviceId: `browser-${Math.random().toString(36).substr(2, 9)}`
  });

  // Setup event listener SEBELUM connect
  client.onOpReceived = (op) => {
    console.log('📡 Real-time update dari server:', op);

    // Trigger custom event untuk framework UI (React/Vue/Svelte)
    window.dispatchEvent(new CustomEvent('osp-update', { detail: op }));
  };

  client.onDisconnected = () => {
    console.log('⚠️ Terputus dari OSP. Akan auto-reconnect...');
    window.dispatchEvent(new CustomEvent('osp-disconnected'));
  };

  try {
    await client.connect();
    console.log('✅ Terhubung ke OSP Server');

    // Subscribe ke collection (dengan snapshot awal)
    await client.subscribe('todos', null, true);
    console.log('📌 Subscribed to todos');

    return client;
  } catch (err) {
    console.error('❌ Gagal connect:', err);
    throw err;
  }
}

export function getTodo(recordId) {
  if (!client) throw new Error('OSP Client belum diinisialisasi');
  return client.get('todos', recordId);
}

export function getAllTodos() {
  if (!client) throw new Error('OSP Client belum diinisialisasi');
  // Catatan: Di implementasi nyata, Anda perlu expose method listRecords di client
  // atau iterate manual jika diperlukan
  return null;
}

export function disconnectOsp() {
  if (client) {
    client.disconnect();
    client = null;
  }
}
