import { WebSocket } from 'ws';

export interface OnlineUser {
  ws: WebSocket;
  id: string;
  email: string;
  name: string;
}

export interface IncomingMessage {
  type: 'login' | 'chatHistory' | 'chatMessage';
  data: any;
}

export interface Message {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  content: string;
  parent: string | null;
  files: { fileName: string; data: string }[];
  replies: Message[];
  createdAt: string;
  __v: number;
}

export interface GetMessages {
  messages: Message[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    nextPage: number | null;
  };
}
