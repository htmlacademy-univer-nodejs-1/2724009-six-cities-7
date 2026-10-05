import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import type { Offer } from '../../../types/index.js';
import type { FileReader } from './reader.interface.js';
import { parseOffer } from './parse-offer.js';

export class TsvOfferReader implements FileReader<Offer> {
  constructor(private readonly filePath: string) {}

  public async *read(): AsyncIterableIterator<Offer> {
    const input = createReadStream(this.filePath, { encoding: 'utf-8' });
    const lines = createInterface({ input, crlfDelay: Infinity });
    let lineNumber = 0;

    try {
      for await (const line of lines) {
        lineNumber++;

        if (!line.trim()) {
          continue;
        }

        let offer: Offer;

        try {
          offer = parseOffer(line);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);

          throw new Error(`Строка ${lineNumber}: ${message}`);
        }

        yield offer;
      }
    } finally {
      lines.close();
      input.destroy();
    }
  }
}
