import { WebSocketServer } from 'ws';
import { notificationEmitter } from './notificationEmitter.js';

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/notifications' });
  
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    if (userId) {
      notificationEmitter.addConnection(userId, ws);
      console.log(`User ${userId} connected for notifications`);
      
      // Send connection confirmation
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to notifications'
      }));
    } else {
      ws.close(1008, 'User ID required');
      return;
    }
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    ws.on('close', () => {
      console.log(`User ${userId} disconnected from notifications`);
    });
  });
  
  console.log('WebSocket server setup complete on path: /notifications');
}