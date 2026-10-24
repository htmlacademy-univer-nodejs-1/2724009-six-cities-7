import pino from 'pino';
import { injectable } from 'inversify';
import type { Logger } from './logger.interface.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger = pino();

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }
}
