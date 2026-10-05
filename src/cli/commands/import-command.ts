import { extname } from 'node:path';
import chalk from 'chalk';
import { TsvOfferReader } from '../../shared/libs/file-reader/index.js';
import { formatJson } from '../format-json.js';
import type { CliCommand } from './cli-command.interface.js';

export class ImportCommand implements CliCommand {
  public readonly name = '--import';

  public async run(...args: string[]): Promise<void> {
    const [filePath] = args;

    if (args.length !== 1 || !filePath.trim()) {
      throw new Error('Использование: --import <path>. Укажи путь к одному TSV-файлу');
    }

    if (extname(filePath).toLowerCase() !== '.tsv') {
      throw new Error('Для импорта требуется файл с расширением .tsv');
    }

    const reader = new TsvOfferReader(filePath);
    let count = 0;

    console.log(`${chalk.bold.magenta('Чтение TSV:')} ${chalk.yellow(filePath)}`);

    for await (const offer of reader.read()) {
      count++;

      const author = {
        name: offer.author.name,
        email: offer.author.email,
        avatarUrl: offer.author.avatarUrl,
        type: offer.author.type,
      };

      console.log(`\n${chalk.bold.magenta(`Предложение №${count}`)} ${chalk.gray('—')} ${chalk.bold(offer.title)}`);
      console.log(formatJson({ ...offer, author }));
    }

    console.log(`\n${chalk.bold.green(`Обработано предложений: ${count}`)}`);
  }
}
