import { WebSocket } from 'ws';

export interface OnlineUser {
  ws: WebSocket;
  id: string;
  email: string;
  name: string;
}

export interface ChatMessage {
  user: string;
  content: string;
  parentId?: string;
}

export interface IncomingMessage {
  type: 'login' | 'chatMessage';
  data: any;
}
