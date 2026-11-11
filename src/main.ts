import type { Application } from './app/application.js';
import type { Logger } from './shared/libs/logger/logger.interface.js';
import { container } from './container.js';
import { Component } from './shared/types/component.js';

const logger = container.get<Logger>(Component.Logger);

try {
  const application = container.get<Application>(Component.Application);

  await application.init();

  const shutdown = (): void => {
    application.close().catch((error: unknown) => {
      logger.error(error instanceof Error ? error.message : 'Ошибка остановки приложения');
      process.exitCode = 1;
    });
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
} catch (error) {
  logger.error(error instanceof Error ? error.message : 'Ошибка инициализации приложения');
  process.exitCode = 1;
}
