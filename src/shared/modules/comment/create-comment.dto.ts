import type { Comment } from '../../../types/comment.type.js';

export type CreateCommentDto = Pick<Comment, 'text' | 'rating'> & {
  author: string;
  offer: string;
};
