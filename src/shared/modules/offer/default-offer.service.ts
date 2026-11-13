import { isObjectIdOrHexString, Types, type Model } from 'mongoose';
import { inject, injectable } from 'inversify';
import type { City } from '../../../types/city.type.js';
import { Component } from '../../types/component.js';
import type { CommentEntity } from '../comment/comment.entity.js';
import type { UserService } from '../user/user-service.interface.js';
import type { CreateOfferDto } from './create-offer.dto.js';
import type { UpdateOfferDto } from './update-offer.dto.js';
import type { OfferDocument, OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';

const DEFAULT_LIMIT = 60;
const PREMIUM_LIMIT = 3;
const PREVIEW_FIELDS = 'title price type isFavorite publishedAt city previewImage isPremium rating commentCount';
const UPDATE_FIELDS = [
  'title', 'description', 'city', 'previewImage', 'images', 'isPremium',
  'type', 'roomCount', 'guestCount', 'price', 'amenities', 'location',
];

type OfferStatistics = { rating: number; commentCount: number };

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: Model<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: Model<CommentEntity>,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {}

  public async create(data: CreateOfferDto): Promise<OfferDocument> {
    if (!isObjectIdOrHexString(data.author)) {
      throw new Error('Некорректный идентификатор автора предложения');
    }

    return this.offerModel.create({
      ...data,
      author: new Types.ObjectId(data.author),
      rating: 0,
      commentCount: 0,
      isFavorite: false,
    });
  }

  public async findById(id: string, viewerId?: string): Promise<OfferDocument | null> {
    if (!isObjectIdOrHexString(id)) {
      return null;
    }

    const offer = await this.offerModel.findById(id).populate('author', 'name email avatarUrl type').exec();

    if (offer) {
      await this.setFavoriteStatus([offer], viewerId);
    }

    return offer;
  }

  public async find(limit = DEFAULT_LIMIT, viewerId?: string): Promise<OfferDocument[]> {
    if (!Number.isSafeInteger(limit) || limit < 1) {
      throw new Error('Количество предложений должно быть положительным целым числом');
    }

    const offers = await this.offerModel.find()
      .select(PREVIEW_FIELDS)
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .exec();

    return this.setFavoriteStatus(offers, viewerId);
  }

  public async findPremiumByCity(city: City, viewerId?: string): Promise<OfferDocument[]> {
    const offers = await this.offerModel.find({ city, isPremium: true })
      .select(PREVIEW_FIELDS)
      .sort({ publishedAt: -1, _id: -1 })
      .limit(PREMIUM_LIMIT)
      .exec();

    return this.setFavoriteStatus(offers, viewerId);
  }

  public async findFavorites(userId: string): Promise<OfferDocument[]> {
    const user = await this.userService.findById(userId);

    if (!user) {
      return [];
    }

    const offers = await this.offerModel.find({ _id: { $in: user.favoriteOffers } })
      .select(PREVIEW_FIELDS)
      .sort({ publishedAt: -1, _id: -1 })
      .exec();

    offers.forEach((offer) => {
      offer.isFavorite = true;
    });

    return offers;
  }

  public async updateById(id: string, authorId: string, data: UpdateOfferDto): Promise<OfferDocument | null> {
    await this.checkAuthor(id, authorId);
    const fields = Object.fromEntries(Object.entries(data)
      .filter(([key, value]) => UPDATE_FIELDS.includes(key) && value !== undefined));

    if (Object.keys(fields).length === 0) {
      throw new Error('Необходимо передать изменяемые поля предложения');
    }

    const offer = await this.offerModel.findOneAndUpdate(
      { _id: id, author: authorId },
      { $set: fields },
      { new: true },
    ).populate('author', 'name email avatarUrl type').exec();

    if (offer) {
      await this.setFavoriteStatus([offer], authorId);
    }

    return offer;
  }

  public async deleteById(id: string, authorId: string): Promise<void> {
    await this.checkAuthor(id, authorId);
    await this.offerModel.deleteOne({ _id: id, author: authorId }).exec();
    await this.commentModel.deleteMany({ offer: new Types.ObjectId(id) }).exec();
    await this.userService.removeOfferFromFavorites(id);
  }

  public async recalculateRatingAndCommentCount(offerId: string): Promise<void> {
    const [statistics] = await this.commentModel.aggregate<OfferStatistics>([
      { $match: { offer: new Types.ObjectId(offerId) } },
      { $group: { _id: null, rating: { $avg: '$rating' }, commentCount: { $sum: 1 } } },
    ]).exec();
    const commentCount = statistics?.commentCount ?? 0;
    const rating = Number((statistics?.rating ?? 0).toFixed(1));

    // Новые комментарии не должны перезаписать более свежий результат старым счётчиком.
    await this.offerModel.updateOne(
      { _id: offerId, commentCount: { $lte: commentCount } },
      { $set: { rating, commentCount } },
    ).exec();
  }

  private async checkAuthor(id: string, authorId: string): Promise<void> {
    const offer = await this.offerModel.findById(id).select('author').exec();

    if (!offer) {
      throw new Error('Предложение не найдено');
    }

    if (offer.author.toString() !== authorId) {
      throw new Error('Изменять и удалять предложение может только его автор');
    }
  }

  private async setFavoriteStatus(offers: OfferDocument[], userId?: string): Promise<OfferDocument[]> {
    const user = userId ? await this.userService.findById(userId) : null;

    offers.forEach((offer) => {
      offer.isFavorite = user?.favoriteOffers.some((id) => id.equals(offer._id)) ?? false;
    });

    return offers;
  }
}
