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

export interface Message {
  _id: string;
  user: string;
  content: string;
  parent: string | null;
  replies: Message[];
  createdAt: string;
  __v: number;
}
