import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { Offer } from '../../../types/index.js';
import { offerToTsv } from '../../helpers/index.js';
import type { FileWriter } from './writer.interface.js';

export class TsvOfferWriter implements FileWriter<Offer> {
  constructor(private readonly filePath: string) {}

  public async write(offers: Iterable<Offer> | AsyncIterable<Offer>): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });

    const output = createWriteStream(this.filePath, { encoding: 'utf-8', flags: 'wx' });

    await pipeline(this.toLines(offers), output);
  }

  private async *toLines(offers: Iterable<Offer> | AsyncIterable<Offer>): AsyncIterableIterator<string> {
    for await (const offer of offers) {
      yield `${offerToTsv(offer)}\n`;
    }
  }
}
