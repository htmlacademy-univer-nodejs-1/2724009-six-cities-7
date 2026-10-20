import { inject, injectable } from 'inversify';
import type { Logger } from '../shared/libs/logger/logger.interface.js';
import type { Config } from '../shared/libs/config/config.interface.js';
import { Component } from '../shared/types/component.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.Logger)
    private readonly logger: Logger,
    @inject(Component.Config)
    private readonly config: Config,
  ) {}

  public init(): void {
    this.logger.info(`Приложение инициализировано. Порт: ${this.config.get('PORT')}`);
  }
}
