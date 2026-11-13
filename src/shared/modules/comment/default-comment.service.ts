import { isObjectIdOrHexString, Types, type Model } from 'mongoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.js';
import type { OfferService } from '../offer/offer-service.interface.js';
import type { CommentDocument, CommentEntity } from './comment.entity.js';
import type { CreateCommentDto } from './create-comment.dto.js';
import type { CommentService } from './comment-service.interface.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: Model<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async findByOfferId(offerId: string): Promise<CommentDocument[]> {
    if (!isObjectIdOrHexString(offerId)) {
      return [];
    }

    return this.commentModel.find({ offer: offerId })
      .sort({ publishedAt: -1, _id: -1 })
      .limit(50)
      .populate('author', 'name email avatarUrl type')
      .exec();
  }

  public async create(data: CreateCommentDto): Promise<CommentDocument> {
    if (!await this.offerService.findById(data.offer)) {
      throw new Error('Предложение не найдено');
    }

    const comment = await this.commentModel.create({
      text: data.text,
      rating: data.rating,
      author: new Types.ObjectId(data.author),
      offer: new Types.ObjectId(data.offer),
    });
    await this.offerService.recalculateRatingAndCommentCount(data.offer);

    return comment.populate('author', 'name email avatarUrl type');
  }
}
