import { Document, Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UsersDocument = Document & {
  id: number,
  email: string,
  password: string,
  name: string,
  createdAt: Date,

  comparePassword: (password: string) => Promise<boolean>;
};

const usersSchema = new Schema<UsersDocument>({
  id: { type: Number, index: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

usersSchema.pre<UsersDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usersSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const users = (models.users ||
  model<UsersDocument>('users', usersSchema, process.env.DB_USERS_COLLECTION)
);
