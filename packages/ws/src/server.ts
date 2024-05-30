import type { IncomingMessage, Message, OnlineUser } from './types';

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

const fetchMessages = async (pageNumber: number): Promise<Message[]> => {
  try {
    const response = await api.get('/messages', { params: { pageNumber } });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw new Error('Failed to fetch messages');
  }
};

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

      const messages = await fetchMessages(1);
      ws.send(JSON.stringify({ type: 'chatHistory', data: messages }));
    } else if (data.type === 'chatHistory') {
      try {
        const messages = await fetchMessages(data.data.pageNumber);
        ws.send(JSON.stringify({ type: 'chatHistory', data: messages }));
      } catch (err) {
        console.error('Failed to fetch messages from backend', err);
      }
    } else if (data.type === 'chatMessage') {
      try {
        const { token, ...restMessageData } = messageData;
        const response = await api.post('/send-message', restMessageData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const { _id, user, content, replies, createdAt, __v } = response.data.data;
          broadcastNewMessage({
            _id,
            user: user._id,
            name: user.name,
            content,
            parent: null,
            replies,
            createdAt,
            __v,
          });
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

const broadcastNewMessage = (message: Message) => {
  const msg = JSON.stringify({ type: 'newMessage', data: message });

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
