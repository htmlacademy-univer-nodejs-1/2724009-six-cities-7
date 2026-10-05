import type { Amenity } from './amenity.type.js';
import type { City } from './city.type.js';
import type { HousingType } from './housing-type.type.js';
import type { Location } from './location.type.js';
import type { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  publishedAt: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  roomCount: number;
  guestCount: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentCount: number;
  location: Location;
};
