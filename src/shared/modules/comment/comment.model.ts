import { model, Schema } from 'mongoose';
import type { CommentEntity } from './comment.entity.js';

export const commentSchema = new Schema<CommentEntity>({
  text: { type: String, required: true },
  publishedAt: { type: Date, required: true, default: Date.now },
  rating: { type: Number, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  offer: { type: Schema.Types.ObjectId, ref: 'Offer', required: true },
}, {
  collection: 'comments',
  timestamps: true,
});

commentSchema.index({ offer: 1, publishedAt: -1, _id: -1 });

export const CommentModel = model<CommentEntity>('Comment', commentSchema);
