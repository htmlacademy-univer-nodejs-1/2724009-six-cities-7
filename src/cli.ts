#!/usr/bin/env node

import chalk from 'chalk';
import dotenv from 'dotenv';
import type { Model } from 'mongoose';
import { container } from './container.js';
import { Component } from './shared/types/component.js';
import type { DatabaseClient } from './shared/libs/database-client/database-client.interface.js';
import type { UserEntity, UserService } from './shared/modules/user/index.js';
import type { OfferEntity, OfferService } from './shared/modules/offer/index.js';
import { CliApp, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';

const cli = new CliApp();
const importCommand = new ImportCommand({
  databaseClient: container.get<DatabaseClient>(Component.DatabaseClient),
  userService: container.get<UserService>(Component.UserService),
  offerService: container.get<OfferService>(Component.OfferService),
  getSalt: () => {
    dotenv.config({ quiet: true });
    const salt = process.env.SALT;

    if (!salt?.trim()) {
      throw new Error('Для импорта укажите непустую SALT в .env или переменных окружения');
    }

    return salt;
  },
  initializeModels: async () => {
    await Promise.all([
      container.get<Model<UserEntity>>(Component.UserModel).init(),
      container.get<Model<OfferEntity>>(Component.OfferModel).init(),
    ]);
  },
});

cli.registerCommands([new HelpCommand(), new VersionCommand(), importCommand, new GenerateCommand()]);

cli.run(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`${chalk.bold.red('Ошибка:')} ${chalk.red(message)}`);
  process.exitCode = 1;
});
