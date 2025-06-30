import { WebSocketServer } from 'ws';
import http from 'http';
const server = http.createServer();
const wss = new WebSocketServer({ server });

function broadcastStats() {
  const stats = {
    timestamp: Date.now(),
    value: Math.random() * 100,
  };
  const message = JSON.stringify(stats);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

setInterval(broadcastStats, 1000);

server.listen(3001, () => {
  console.log('WebSocket server running on port 3001');
});
