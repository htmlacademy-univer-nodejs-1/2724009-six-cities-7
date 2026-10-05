import type { Amenity, City, HousingType, Offer, User } from '../../../types/index.js';

const CITIES: readonly City[] = [
  'Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf',
];
const HOUSING_TYPES: readonly HousingType[] = ['apartment', 'house', 'room', 'hotel'];
const USER_TYPES: readonly User['type'][] = ['regular', 'pro'];
const AMENITIES: readonly Amenity[] = [
  'Breakfast', 'Air conditioning', 'Laptop friendly workspace',
  'Baby seat', 'Washer', 'Towels', 'Fridge',
];

type Limits = {
  min: number;
  max: number;
  integer?: boolean;
};

function parseText(value: string, field: string, limits: Limits): string {
  const text = value.trim();

  if (text.length < limits.min || text.length > limits.max) {
    throw new Error(`${field}: длина должна быть от ${limits.min} до ${limits.max} символов`);
  }

  return text;
}

function parseNumber(value: string, field: string, limits: Limits): number {
  const number = Number(value);

  if (!value.trim() || !Number.isFinite(number) || number < limits.min || number > limits.max) {
    throw new Error(`${field}: ожидается число от ${limits.min} до ${limits.max}`);
  }

  if (limits.integer && !Number.isInteger(number)) {
    throw new Error(`${field}: ожидается целое число`);
  }

  return number;
}

function parseBoolean(value: string, field: string): boolean {
  if (value !== 'true' && value !== 'false') {
    throw new Error(`${field}: ожидается true или false`);
  }

  return value === 'true';
}

function parseChoice<T extends string>(value: string, allowed: readonly T[], field: string): T {
  const choice = allowed.find((item) => item === value);

  if (choice === undefined) {
    throw new Error(`${field}: недопустимое значение «${value}»`);
  }

  return choice;
}

export function parseOffer(line: string): Offer {
  const fields = line.replace(/^\uFEFF/, '').replace(/\r$/, '').split('\t');

  if (fields.length !== 21) {
    throw new Error(`Ожидается 21 поле, разделённое табуляцией; получено ${fields.length}`);
  }

  const [
    title, description, date, city, previewImage, imageList,
    isPremium, isFavorite, rating, housingType, roomCount, guestCount,
    price, amenityList, name, email, avatarUrl, password, userType,
    latitude, longitude,
  ] = fields;

  const publishedAt = new Date(date);

  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error('Дата публикации: недопустимая дата');
  }

  const images = imageList.split(';').map((image) => image.trim());

  if (images.length !== 6 || images.some((image) => !image)) {
    throw new Error('Фотографии: требуется ровно 6 непустых путей');
  }

  if (!previewImage.trim()) {
    throw new Error('Превью изображения: путь не должен быть пустым');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email автора: недопустимый адрес');
  }

  if (avatarUrl && !/\.(jpg|png)([?#].*)?$/i.test(avatarUrl)) {
    throw new Error('Аватар автора: требуется изображение .jpg или .png');
  }

  const parsedRating = parseNumber(rating, 'Рейтинг', { min: 1, max: 5 });

  if (!Number.isInteger(parsedRating * 10)) {
    throw new Error('Рейтинг: допускается не более одного знака после точки');
  }

  return {
    title: parseText(title, 'Название', { min: 10, max: 100 }),
    description: parseText(description, 'Описание', { min: 20, max: 1024 }),
    publishedAt,
    city: parseChoice(city, CITIES, 'Город'),
    previewImage: previewImage.trim(),
    images,
    isPremium: parseBoolean(isPremium, 'Премиум'),
    isFavorite: parseBoolean(isFavorite, 'Избранное'),
    rating: parsedRating,
    type: parseChoice(housingType, HOUSING_TYPES, 'Тип жилья'),
    roomCount: parseNumber(roomCount, 'Количество комнат', { min: 1, max: 8, integer: true }),
    guestCount: parseNumber(guestCount, 'Количество гостей', { min: 1, max: 10, integer: true }),
    price: parseNumber(price, 'Стоимость аренды', { min: 100, max: 100000 }),
    amenities: amenityList.split(';').map((amenity) => parseChoice(amenity.trim(), AMENITIES, 'Удобства')),
    author: {
      name: parseText(name, 'Имя автора', { min: 1, max: 15 }),
      email,
      avatarUrl: avatarUrl || undefined,
      password: parseText(password, 'Пароль автора', { min: 6, max: 12 }),
      type: parseChoice(userType, USER_TYPES, 'Тип пользователя'),
    },
    commentCount: 0,
    location: {
      latitude: parseNumber(latitude, 'Широта', { min: -90, max: 90 }),
      longitude: parseNumber(longitude, 'Долгота', { min: -180, max: 180 }),
    },
  };
}
