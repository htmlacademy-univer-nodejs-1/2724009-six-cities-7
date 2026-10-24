import type { RestSchema } from './rest.schema.js';

export interface Config {
  get<Key extends keyof RestSchema>(key: Key): RestSchema[Key];
}
