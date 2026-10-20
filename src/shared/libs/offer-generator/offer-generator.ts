import { getRandomInteger, getRandomItem } from '../../helpers/index.js';
import type { MockServerData, Offer } from '../../../types/index.js';

const REQUIRED_IMAGE_COUNT = 6;

export class OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): Offer {
    const city = getRandomItem(this.mockData.cities);
    const images = this.mockData.images.slice(0, REQUIRED_IMAGE_COUNT);

    if (images.length !== REQUIRED_IMAGE_COUNT) {
      throw new Error('Для генерации предложения нужно минимум 6 фотографий');
    }

    const amenities = this.mockData.amenities.filter(() => getRandomInteger(0, 1) === 1);

    if (amenities.length === 0) {
      amenities.push(getRandomItem(this.mockData.amenities));
    }

    return {
      title: getRandomItem(this.mockData.titles),
      description: getRandomItem(this.mockData.descriptions),
      publishedAt: new Date(),
      city: city.name,
      previewImage: getRandomItem(images),
      images,
      isPremium: getRandomInteger(0, 1) === 1,
      isFavorite: false,
      rating: getRandomInteger(10, 50) / 10,
      type: getRandomItem(this.mockData.housingTypes),
      roomCount: getRandomInteger(1, 8),
      guestCount: getRandomInteger(1, 10),
      price: getRandomInteger(100, 100000),
      amenities,
      author: { ...getRandomItem(this.mockData.authors) },
      commentCount: 0,
      location: { ...city.location },
    };
  }
}
