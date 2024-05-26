import mongoose from 'mongoose';

export type UsersDocument = mongoose.Document & {
  id: number,
  email: string,
  password: string,
  name: string,
  createdAt: Date,
};

const usersSchema = new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  email: String,
  password: String,
  name: String,
  createdAt: { type: Date, default: Date.now },
});

export const users = (mongoose.models.users ||
  mongoose.model<UsersDocument>('users', usersSchema, process.env.DB_USERS_COLLECTION)
);
