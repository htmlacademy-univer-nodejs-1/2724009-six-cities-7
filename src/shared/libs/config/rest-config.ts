import convict from 'convict';
import validatorFormats from 'convict-format-with-validator';
import dotenv from 'dotenv';
import { injectable } from 'inversify';
import type { Config } from './config.interface.js';
import { portFormat, restSchema, type RestSchema } from './rest.schema.js';

@injectable()
export class RestConfig implements Config {
  private readonly config: RestSchema;

  constructor() {
    const result = dotenv.config({ quiet: true });

    if (result.error) {
      throw new Error('Не удалось прочитать файл .env');
    }

    convict.addFormats(validatorFormats);
    convict.addFormat(portFormat);
    const config = convict<RestSchema>(restSchema);
    config.validate({ allowed: 'strict' });
    this.config = config.getProperties();
  }

  public get<Key extends keyof RestSchema>(key: Key): RestSchema[Key] {
    return this.config[key];
  }
}
