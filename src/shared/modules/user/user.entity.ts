import type { HydratedDocument, Types } from 'mongoose';
import type { User } from '../../../types/user.type.js';
import type { DocumentTimestamps } from '../../types/document-timestamps.js';

export type UserEntity = User & DocumentTimestamps & {
  favoriteOffers: Types.ObjectId[];
};

export type UserDocument = HydratedDocument<UserEntity>;
