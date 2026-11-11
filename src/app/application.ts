import { inject, injectable } from 'inversify';
import type { Logger } from '../shared/libs/logger/logger.interface.js';
import type { Config } from '../shared/libs/config/config.interface.js';
import type { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { getMongoURI } from '../shared/helpers/get-mongo-uri.js';
import { Component } from '../shared/types/component.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.Logger)
    private readonly logger: Logger,
    @inject(Component.Config)
    private readonly config: Config,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
  ) {}

  public async init(): Promise<void> {
    const uri = getMongoURI({
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      database: this.config.get('DB_NAME'),
      username: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
    });

    await this.databaseClient.connect(uri);
    this.logger.info(`Приложение инициализировано. Порт: ${this.config.get('PORT')}`);
  }

  public async close(): Promise<void> {
    await this.databaseClient.disconnect();
  }
}
