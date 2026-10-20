export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomItem<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('Нельзя выбрать случайный элемент из пустого массива');
  }

  return items[getRandomInteger(0, items.length - 1)];
}
