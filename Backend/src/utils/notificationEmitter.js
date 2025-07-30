// notificationEmitter.js - WebSocket/SSE emitter
import { EventEmitter } from 'events';

class NotificationEmitter extends EventEmitter {
  constructor() {
    super();
    this.userConnections = new Map(); // userId -> connection
  }

  addConnection(userId, connection) {
    this.userConnections.set(userId, connection);
    
    // Clean up on disconnect
    connection.on('close', () => {
      this.userConnections.delete(userId);
    });
  }

  emitToUser(userId, notification) {
    const connection = this.userConnections.get(userId);
    if (connection && connection.readyState === 1) { // WebSocket.OPEN
      connection.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
    }
  }
}

export const notificationEmitter = new NotificationEmitter();