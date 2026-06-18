/**
 * OSP Client for Browser
 * Connects to OSP server via WebSocket
 */

// Simple EventEmitter for browser
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(...args);
        } catch (err) {
          console.error(`Error in event handler for ${event}:`, err);
        }
      });
    }
  }
}

class OspClient extends EventEmitter {
  constructor(host, port, token) {
    super();
    this.host = host;
    this.port = port;
    this.token = token;
    this.ws = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.subscriptions = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const url = `ws://${this.host}:${this.port}`;
      console.log(`[OSP] Connecting to ${url}...`);

      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('[OSP] Connected');
        this.reconnectAttempts = 0;
        this.authenticate().then(resolve).catch(reject);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (err) {
          console.error('[OSP] Failed to parse message:', err);
        }
      };

      this.ws.onclose = () => {
        console.log('[OSP] Disconnected');
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[OSP] Error:', error);
        reject(error);
      };
    });
  }

  async authenticate() {
    return this.send('AUTH', { token: this.token });
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[OSP] Max reconnect attempts reached');
      this.emit('error', new Error('Connection lost'));
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[OSP] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().then(() => {
        // Re-subscribe to collections
        this.subscriptions.forEach(collection => {
          this.subscribe(collection);
        });
      }).catch(err => {
        console.error('[OSP] Reconnect failed:', err);
      });
    }, delay);
  }

  send(type, payload) {
    return new Promise((resolve, reject) => {
      const reqId = ++this.requestId;

      const message = {
        type,
        requestId: reqId,
        payload,
        timestamp: Date.now()
      };

      this.pendingRequests.set(reqId, { resolve, reject });
      this.ws.send(JSON.stringify(message));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(reqId)) {
          this.pendingRequests.delete(reqId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  handleMessage(message) {
    // Handle response
    if (message.requestId && this.pendingRequests.has(message.requestId)) {
      const { resolve, reject } = this.pendingRequests.get(message.requestId);
      this.pendingRequests.delete(message.requestId);

      if (message.success) {
        resolve(message.payload);
      } else {
        reject(new Error(message.error || 'Unknown error'));
      }
      return;
    }

    // Handle event
    if (message.type) {
      this.emit(message.type, message.payload);
    }
  }

  async subscribe(collection) {
    this.subscriptions.add(collection);
    return this.send('SUBSCRIBE', {
      collection,
      withSnapshot: true
    });
  }

  async set(collection, recordId, fields) {
    return this.send('PATCH', {
      collection,
      recordId,
      fields
    });
  }

  async delete(collection, recordId) {
    return this.send('DELETE', {
      collection,
      recordId
    });
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

window.OspClient = OspClient;
