import type { IncomingMessage, OnlineUser } from './types';

import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const onlineUsers: Record<string, OnlineUser> = {};

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);

    const data: IncomingMessage = JSON.parse(message);

    if (data.type === 'login') {
      const { data: messageData } = data;
      onlineUsers[messageData.id] = {
        ws,
        id: messageData.id,
        email: messageData.email,
        name: messageData.name,
      };
      broadcastOnlineUsers();
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    
    for (const userId in onlineUsers) {
      if (onlineUsers[userId].ws === ws) {
        delete onlineUsers[userId];
        break;
      }
    }
    broadcastOnlineUsers();
  });
});

const broadcastOnlineUsers = () => {
  const onlineUsersList = Object
    .values(onlineUsers)
    .map((user) => ({ id: user.id, email: user.email, name: user.name }));
  const message = JSON.stringify({ type: 'onlineUsers', data: { users: onlineUsersList } });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});
