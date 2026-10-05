import type { User } from './user.type.js';

export type Comment = {
  text: string;
  publishedAt: Date;
  rating: number;
  author: User;
};
