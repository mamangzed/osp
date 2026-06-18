/**
 * OSP WebSocket Client for Browser
 */

class OspClient {
    constructor(url, token) {
        this.url = url;
        this.token = token;
        this.ws = null;
        this.requestId = 0;
        this.pendingRequests = new Map();
        this.eventHandlers = new Map();
        this.subscriptions = new Set();
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log('🔌 WebSocket connected');
                this._authenticate().then(resolve).catch(reject);
            };

            this.ws.onmessage = (event) => {
                this._handleMessage(JSON.parse(event.data));
            };

            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
            };

            this.ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                reject(error);
            };
        });
    }

    _authenticate() {
        return this._send('AUTH', { token: this.token });
    }

    _send(type, payload) {
        return new Promise((resolve, reject) => {
            const reqId = ++this.requestId;

            const message = {
                type: type,
                requestId: reqId,
                payload: payload,
                timestamp: Date.now()
            };

            this.pendingRequests.set(reqId, { resolve, reject });
            this.ws.send(JSON.stringify(message));

            setTimeout(() => {
                if (this.pendingRequests.has(reqId)) {
                    this.pendingRequests.delete(reqId);
                    reject(new Error('Request timeout'));
                }
            }, 30000);
        });
    }

    _handleMessage(message) {
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

        if (message.type) {
            this._emit(message.type, message.payload);
        }
    }

    _emit(event, data) {
        const handlers = this.eventHandlers.get(event) || [];
        handlers.forEach(handler => handler(data));
    }

    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }

    async subscribe(collection) {
        this.subscriptions.add(collection);
        return this._send('SUBSCRIBE', {
            collection: collection,
            withSnapshot: true
        });
    }

    async set(collection, recordId, fields) {
        return this._send('PATCH', {
            collection: collection,
            recordId: recordId,
            fields: fields
        });
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

window.OspClient = OspClient;
