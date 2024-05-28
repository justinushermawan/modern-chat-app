import { WebSocket } from "ws";

export interface OnlineUser {
  ws: WebSocket;
  id: string;
  email: string;
  name: string;
}

export interface IncomingMessage {
  type: 'login' | 'chat';
  data: any;
}
