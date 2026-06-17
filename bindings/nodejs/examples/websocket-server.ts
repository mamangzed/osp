import { OwlServer } from '../src/server';
import { validateToken } from './auth-example';

const server = new OwlServer({
  port: 8080,           // TCP port
  wsPort: 8081,         // WebSocket port (optional)
  heartbeatIntervalMs: 15000,
  validateToken
});

server.listen().then(() => {
  console.log('🦉 OSP Server started');
  console.log('   TCP:        127.0.0.1:8080');
  console.log('   WebSocket:  ws://127.0.0.1:8081');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.close();
  process.exit(0);
});
