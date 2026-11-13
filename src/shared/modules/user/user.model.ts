import { model, Schema } from 'mongoose';
import type { UserEntity } from './user.entity.js';

export const userSchema = new Schema<UserEntity>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  avatarUrl: String,
  password: { type: String, required: true, select: false },
  type: { type: String, required: true },
  favoriteOffers: { type: [{ type: Schema.Types.ObjectId, ref: 'Offer' }], default: [] },
}, {
  collection: 'users',
  timestamps: true,
});

export const UserModel = model<UserEntity>('User', userSchema);
