import type { Offer } from '../../types/index.js';

export function offerToTsv(offer: Offer): string {
  const fields = [
    offer.title,
    offer.description,
    offer.publishedAt.toISOString(),
    offer.city,
    offer.previewImage,
    offer.images.join(';'),
    offer.isPremium,
    offer.isFavorite,
    offer.rating,
    offer.type,
    offer.roomCount,
    offer.guestCount,
    offer.price,
    offer.amenities.join(';'),
    offer.author.name,
    offer.author.email,
    offer.author.avatarUrl ?? '',
    offer.author.password,
    offer.author.type,
    offer.location.latitude,
    offer.location.longitude,
  ].map(String);

  if (fields.some((field) => /[\t\r\n]/.test(field))) {
    throw new Error('Поля TSV не должны содержать табуляцию или переносы строк');
  }

  return fields.join('\t');
}
