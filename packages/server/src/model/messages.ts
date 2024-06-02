import { Document, Schema, model, models } from 'mongoose';

import { UsersDocument } from './users';

type File = {
  fileId: string;
  fileName: string;
  data: string;
};

export type MessagesDocument = Document & {
  user: UsersDocument;
  content: string;
  parent: MessagesDocument | null;
  files: File[] | null;
  replies: MessagesDocument[];
  createdAt: Date,
};

const messagesSchema = new Schema<MessagesDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  content: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'messages', default: null },
  files: [
    {
      fileId: { type: String, required: true },
      fileName: { type: String, required: true },
      data: { type: String, required: true },
    },
  ],
  replies: [{ type: Schema.Types.ObjectId, ref: 'messages' }],
  createdAt: { type: Date, default: Date.now },
});

export const messages = (models.messages ||
  model<MessagesDocument>('messages', messagesSchema, process.env.DB_MESSAGES_COLLECTION)
);
