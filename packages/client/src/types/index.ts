export interface OnlineUser {
  id: string;
  email: string;
  name: string;
}

export interface Message {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  content: string;
  parent: string | null;
  files: {
    fileId: string;
    fileName: string;
    data: string;
  }[] | null;
  replies: Message[];
  createdAt: string;
  __v: number;
}

export interface SendMessageFile {
  fileName: string;
  data: string;
}
