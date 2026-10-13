import { extname } from 'node:path';
import axios from 'axios';
import chalk from 'chalk';
import type { Offer } from '../../types/index.js';
import { OfferGenerator, parseMockServerData } from '../../shared/libs/offer-generator/index.js';
import { TsvOfferWriter } from '../../shared/libs/file-writer/index.js';
import type { CliCommand } from './cli-command.interface.js';

const REQUEST_TIMEOUT = 10000;

export class GenerateCommand implements CliCommand {
  public readonly name = '--generate';

  public async run(...args: string[]): Promise<void> {
    if (args.length !== 3 || args.some((arg) => !arg.trim())) {
      throw new Error('Использование: --generate <n> <filepath> <url>');
    }

    const [countArgument, filePath, urlArgument] = args;
    const count = Number(countArgument);

    if (!/^\d+$/.test(countArgument) || !Number.isSafeInteger(count) || count < 1) {
      throw new Error('Количество предложений должно быть положительным целым числом');
    }

    if (extname(filePath).toLowerCase() !== '.tsv') {
      throw new Error('Для генерации требуется путь к файлу с расширением .tsv');
    }

    let url: URL;

    try {
      url = new URL(urlArgument);
    } catch {
      throw new Error('Укажи корректный HTTP или HTTPS адрес сервера заготовок');
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Адрес сервера должен использовать HTTP или HTTPS');
    }

    let responseData: unknown;

    try {
      const response = await axios.get<unknown>(url.href, { timeout: REQUEST_TIMEOUT });
      responseData = response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const reason = error.response ? `HTTP ${error.response.status}` : error.code ?? error.message;
        throw new Error(`Не удалось получить заготовки с сервера: ${reason}`);
      }

      throw error;
    }

    const mockData = parseMockServerData(responseData);
    const generator = new OfferGenerator(mockData);
    const writer = new TsvOfferWriter(filePath);

    console.log(`${chalk.bold.magenta('Генерация TSV:')} ${chalk.yellow(filePath)}`);

    try {
      await writer.write(this.generateOffers(generator, count));
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
        throw new Error('Файл уже существует. Укажи другое имя TSV-файла');
      }

      throw error;
    }

    console.log(chalk.bold.green(`Сгенерировано предложений: ${count}`));
  }

  private *generateOffers(generator: OfferGenerator, count: number): IterableIterator<Offer> {
    for (let i = 0; i < count; i++) {
      yield generator.generate();
    }
  }
}
