import type { HydratedDocument, Types } from 'mongoose';
import type { Offer } from '../../../types/offer.type.js';
import type { DocumentTimestamps } from '../../types/document-timestamps.js';

export type OfferEntity = Omit<Offer, 'author'> & DocumentTimestamps & {
  author: Types.ObjectId;
};

export type OfferDocument = HydratedDocument<OfferEntity>;
