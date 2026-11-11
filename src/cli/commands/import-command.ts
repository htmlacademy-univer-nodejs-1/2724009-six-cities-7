import { extname } from 'node:path';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import chalk from 'chalk';
import { TsvOfferReader } from '../../shared/libs/file-reader/index.js';
import type { DatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import type { UserService } from '../../shared/modules/user/user-service.interface.js';
import type { OfferService } from '../../shared/modules/offer/offer-service.interface.js';
import type { CliCommand } from './cli-command.interface.js';

const PROGRESS_INTERVAL = 100000;

type ImportDependencies = {
  databaseClient: DatabaseClient;
  userService: UserService;
  offerService: OfferService;
  getSalt: () => string;
  initializeModels: () => Promise<void>;
};

export class ImportCommand implements CliCommand {
  public readonly name = '--import';

  constructor(private readonly dependencies: ImportDependencies) {}

  public async run(...args: string[]): Promise<void> {
    if (args.length !== 2 || args.some((arg) => !arg.trim())) {
      throw new Error('Использование: --import <path> <mongodb-uri>');
    }

    const [filePath, uri] = args;

    if (extname(filePath).toLowerCase() !== '.tsv') {
      throw new Error('Для импорта требуется файл с расширением .tsv');
    }

    if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) {
      throw new Error('Строка подключения должна начинаться с mongodb:// или mongodb+srv://');
    }

    await access(filePath, constants.R_OK);

    const { databaseClient, userService, offerService, getSalt, initializeModels } = this.dependencies;
    const salt = getSalt();
    const reader = new TsvOfferReader(filePath);
    let count = 0;
    let userCount = 0;

    await databaseClient.connect(uri);

    try {
      await initializeModels();
      console.log(`${chalk.bold.magenta('Импорт TSV:')} ${chalk.yellow(filePath)}`);

      for await (const offer of reader.read()) {
        let author = await userService.findByEmail(offer.author.email);

        if (!author) {
          author = await userService.create(offer.author, salt);
          userCount++;
        }

        await offerService.create({ ...offer, author: author._id.toString() });
        count++;

        if (count % PROGRESS_INTERVAL === 0) {
          console.log(chalk.gray(`Сохранено предложений: ${count}`));
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';

      throw new Error(`Импорт остановлен. Сохранено предложений: ${count}. ${message}`, { cause: error });
    } finally {
      await databaseClient.disconnect();
    }

    console.log(chalk.bold.green(`Импортировано предложений: ${count}`));
    console.log(chalk.bold.green(`Создано пользователей: ${userCount}`));
  }
}
