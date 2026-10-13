import type { MockServerData, Offer } from '../../../types/index.js';
import { offerToTsv } from '../../helpers/index.js';
import { parseOffer } from '../file-reader/index.js';
import { OfferGenerator } from './offer-generator.js';

export function parseMockServerData(value: unknown): MockServerData {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Сервер должен вернуть объект с заготовками');
  }

  const fields = value as Record<string, unknown>;
  const requiredArrays = ['titles', 'descriptions', 'cities', 'housingTypes', 'amenities', 'images', 'authors'];

  for (const key of requiredArrays) {
    const items = fields[key];

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error(`Заготовки: поле ${key} должно быть непустым массивом`);
    }
  }

  const data = value as MockServerData;
  const textArrays = [data.titles, data.descriptions, data.housingTypes, data.amenities, data.images];

  if (textArrays.some((items) => items.some((item) => typeof item !== 'string'))) {
    throw new Error('Названия, описания, типы жилья, удобства и пути к изображениям должны быть строками');
  }

  for (const city of data.cities) {
    if (typeof city !== 'object' || city === null || typeof city.name !== 'string'
      || typeof city.location !== 'object' || city.location === null
      || typeof city.location.latitude !== 'number' || typeof city.location.longitude !== 'number') {
      throw new Error('Город должен содержать название и числовые координаты');
    }
  }

  for (const author of data.authors) {
    if (typeof author !== 'object' || author === null
      || typeof author.name !== 'string' || typeof author.email !== 'string'
      || typeof author.password !== 'string' || typeof author.type !== 'string'
      || (author.avatarUrl !== undefined && typeof author.avatarUrl !== 'string')) {
      throw new Error('Автор должен содержать строковые имя, email, пароль и тип; аватар необязателен');
    }
  }

  if (new Set(data.authors.map((author) => author.email)).size !== data.authors.length) {
    throw new Error('Email авторов в заготовках должны быть уникальными');
  }

  const sample = new OfferGenerator(data).generate();
  const validate = (offer: Offer): void => {
    parseOffer(offerToTsv(offer));
  };

  validate(sample);

  for (const title of data.titles) {
    validate({ ...sample, title });
  }
  for (const description of data.descriptions) {
    validate({ ...sample, description });
  }
  for (const city of data.cities) {
    validate({ ...sample, city: city.name, location: city.location });
  }
  for (const type of data.housingTypes) {
    validate({ ...sample, type });
  }
  for (const amenity of data.amenities) {
    validate({ ...sample, amenities: [amenity] });
  }
  for (const image of data.images) {
    validate({ ...sample, previewImage: image, images: [image, ...sample.images.slice(1)] });
  }
  for (const author of data.authors) {
    validate({ ...sample, author });
  }

  return data;
}
