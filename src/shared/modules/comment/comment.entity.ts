import type { HydratedDocument, Types } from 'mongoose';
import type { Comment } from '../../../types/comment.type.js';
import type { DocumentTimestamps } from '../../types/document-timestamps.js';

export type CommentEntity = Omit<Comment, 'author'> & DocumentTimestamps & {
  author: Types.ObjectId;
  offer: Types.ObjectId;
};

export type CommentDocument = HydratedDocument<CommentEntity>;
