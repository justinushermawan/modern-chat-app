import type { ChatMessage, IncomingMessage, OnlineUser } from './types';

import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import api from './api';

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const onlineUsers: Record<string, OnlineUser> = {};

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', async (message: string) => {
    console.log(`Received message: ${message}`);

    const data: IncomingMessage = JSON.parse(message);
    const { data: messageData } = data;

    if (data.type === 'login') {
      onlineUsers[messageData.id] = {
        ws,
        id: messageData.id,
        email: messageData.email,
        name: messageData.name,
      };
      broadcastOnlineUsers();
    } else if (data.type === 'chatMessage') {
      try {
        const { token, ...restMessageData } = messageData;
        const response = await api.post('/send-message', restMessageData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          broadcastMessage(messageData);
        } else {
          console.error('Failed to send message to backend', response.data);
        }
      } catch (err) {
        console.error('Failed to send message to backend', err);
      }
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

const broadcastMessage = (message: ChatMessage) => {
  const msg = JSON.stringify({ type: 'chatMessage', data: message });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
};

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});
