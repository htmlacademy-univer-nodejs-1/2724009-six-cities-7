import { model, Schema } from 'mongoose';
import type { Location } from '../../../types/location.type.js';
import type { OfferEntity } from './offer.entity.js';
import { UserModel } from '../user/user.model.js';

const locationSchema = new Schema<Location>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, { _id: false });

export const offerSchema = new Schema<OfferEntity>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  city: { type: String, required: true },
  previewImage: { type: String, required: true },
  images: [String],
  isPremium: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  type: { type: String, required: true },
  roomCount: { type: Number, required: true },
  guestCount: { type: Number, required: true },
  price: { type: Number, required: true },
  amenities: [String],
  author: { type: Schema.Types.ObjectId, ref: UserModel.modelName, required: true },
  commentCount: { type: Number, default: 0 },
  location: { type: locationSchema, required: true },
}, {
  collection: 'offers',
  timestamps: true,
});

export const OfferModel = model<OfferEntity>('Offer', offerSchema);
