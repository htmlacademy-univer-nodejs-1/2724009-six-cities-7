import type { CreateCommentDto } from './create-comment.dto.js';
import type { CommentDocument } from './comment.entity.js';

export interface CommentService {
  create(data: CreateCommentDto): Promise<CommentDocument>;
  findByOfferId(offerId: string): Promise<CommentDocument[]>;
}
