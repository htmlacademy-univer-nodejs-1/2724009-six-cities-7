import type { City } from '../../../types/city.type.js';
import type { CreateOfferDto } from './create-offer.dto.js';
import type { UpdateOfferDto } from './update-offer.dto.js';
import type { OfferDocument } from './offer.entity.js';

export interface OfferService {
  create(data: CreateOfferDto): Promise<OfferDocument>;
  findById(id: string, viewerId?: string): Promise<OfferDocument | null>;
  find(limit?: number, viewerId?: string): Promise<OfferDocument[]>;
  findPremiumByCity(city: City, viewerId?: string): Promise<OfferDocument[]>;
  findFavorites(userId: string): Promise<OfferDocument[]>;
  updateById(id: string, authorId: string, data: UpdateOfferDto): Promise<OfferDocument | null>;
  deleteById(id: string, authorId: string): Promise<void>;
  recalculateRatingAndCommentCount(offerId: string): Promise<void>;
}
