import { Document, Schema, model, models } from 'mongoose';

export type MessagesDocument = Document & {
  id: number;
  user: number;
  content: string;
  parent: MessagesDocument | null;
  replies: MessagesDocument[];
  createdAt: Date,
};

const messagesSchema = new Schema<MessagesDocument>({
  id: { type: Number, index: true, unique: true },
  user: { type: Number, required: true },
  content: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'messages', default: null },
  replies: [{ type: Schema.Types.ObjectId, ref: 'messages' }],
  createdAt: { type: Date, default: Date.now },
});

export const messages = (models.users ||
  model<MessagesDocument>('messages', messagesSchema, process.env.DB_MESSAGES_COLLECTION)
);
