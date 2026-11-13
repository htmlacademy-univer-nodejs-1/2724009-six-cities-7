import type { CreateUserDto } from './create-user.dto.js';
import type { UserDocument } from './user.entity.js';

export interface UserService {
  create(data: CreateUserDto, salt: string): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  addFavoriteOffer(userId: string, offerId: string): Promise<UserDocument | null>;
  removeFavoriteOffer(userId: string, offerId: string): Promise<UserDocument | null>;
  removeOfferFromFavorites(offerId: string): Promise<void>;
}
