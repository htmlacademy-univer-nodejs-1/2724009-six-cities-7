import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import type { DatabaseClient } from './database-client.interface.js';
import type { Logger } from '../logger/logger.interface.js';
import { Component } from '../../types/component.js';

const SERVER_SELECTION_TIMEOUT_MS = 5000;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  constructor(
    @inject(Component.Logger)
    private readonly logger: Logger,
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Попытка подключения к MongoDB');

    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS });
    } catch (error) {
      await mongoose.disconnect();
      this.logger.error('Не удалось установить соединение с MongoDB');
      throw new Error('Проверьте адрес MongoDB, логин, пароль и запуск сервера.', { cause: error });
    }

    this.logger.info('Соединение с MongoDB установлено');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Соединение с MongoDB закрыто');
  }
}
