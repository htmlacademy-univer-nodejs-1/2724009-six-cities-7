import type { Format, Schema } from 'convict';

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
};

export const portFormat: Format = {
  name: 'server-port',
  coerce: (value: string): number => value.trim() === '' ? Number.NaN : Number(value),
  validate: (value: unknown): void => {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 65535) {
      throw new Error('PORT должен быть целым числом от 1 до 65535');
    }
  },
};

export const restSchema: Schema<RestSchema> = {
  PORT: {
    doc: 'Порт приложения',
    format: 'server-port',
    default: null,
    env: 'PORT',
  },
  DB_HOST: {
    doc: 'IP-адрес сервера базы данных',
    format: 'ipaddress',
    default: null,
    env: 'DB_HOST',
  },
  SALT: {
    doc: 'Соль для хеширования паролей',
    format: (value: unknown): void => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error('SALT должна быть непустой строкой');
      }
    },
    default: null,
    env: 'SALT',
    sensitive: true,
  },
};
