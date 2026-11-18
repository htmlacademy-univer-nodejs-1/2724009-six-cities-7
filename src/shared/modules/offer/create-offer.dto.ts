import type { Offer } from '../../../types/offer.type.js';

export type CreateOfferDto = Omit<Offer, 'author' | 'rating' | 'commentCount' | 'isFavorite'> & {
  author: string;
};
