import type { Amenity } from './amenity.type.js';
import type { City } from './city.type.js';
import type { HousingType } from './housing-type.type.js';
import type { Location } from './location.type.js';
import type { User } from './user.type.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: {
    name: City;
    location: Location;
  }[];
  housingTypes: HousingType[];
  amenities: Amenity[];
  images: string[];
  authors: User[];
};
