export interface OnlineUser {
  id: string;
  email: string;
  name: string;
}

export interface Message {
  _id: string;
  user: string;
  name: string;
  content: string;
  parent: string | null;
  replies: Message[];
  createdAt: string;
  __v: number;
}
