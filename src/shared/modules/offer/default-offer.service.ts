import { isObjectIdOrHexString, Types, type Model } from 'mongoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.js';
import type { CreateOfferDto } from './create-offer.dto.js';
import type { OfferDocument, OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel)
    private readonly offerModel: Model<OfferEntity>,
  ) {}

  public async create(data: CreateOfferDto): Promise<OfferDocument> {
    if (!isObjectIdOrHexString(data.author)) {
      throw new Error('Некорректный идентификатор автора предложения');
    }

    return this.offerModel.create({ ...data, author: new Types.ObjectId(data.author) });
  }

  public async findById(id: string): Promise<OfferDocument | null> {
    if (!isObjectIdOrHexString(id)) {
      return null;
    }

    return this.offerModel.findById(id).exec();
  }
}
