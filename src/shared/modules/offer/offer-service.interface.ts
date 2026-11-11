import type { CreateOfferDto } from './create-offer.dto.js';
import type { OfferDocument } from './offer.entity.js';

export interface OfferService {
  create(data: CreateOfferDto): Promise<OfferDocument>;
  findById(id: string): Promise<OfferDocument | null>;
}
