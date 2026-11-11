import type { Format, Schema } from 'convict';

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  SALT: string;
};

export const portFormat: Format = {
  name: 'server-port',
  coerce: (value: string): number => value.trim() === '' ? Number.NaN : Number(value),
  validate: (value: unknown): void => {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 65535) {
      throw new Error('Порт должен быть целым числом от 1 до 65535');
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
  DB_PORT: {
    doc: 'Порт MongoDB',
    format: 'server-port',
    default: 27017,
    env: 'DB_PORT',
  },
  DB_NAME: {
    doc: 'Имя базы данных приложения',
    format: String,
    default: 'six-cities',
    env: 'DB_NAME',
  },
  DB_USER: {
    doc: 'Пользователь MongoDB',
    format: String,
    default: null,
    env: 'MONGO_INITDB_ROOT_USERNAME',
  },
  DB_PASSWORD: {
    doc: 'Пароль пользователя MongoDB',
    format: String,
    default: null,
    env: 'MONGO_INITDB_ROOT_PASSWORD',
    sensitive: true,
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
