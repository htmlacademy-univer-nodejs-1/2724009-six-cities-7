#!/usr/bin/env node

import chalk from 'chalk';
import { CliApp, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';

const cli = new CliApp();
cli.registerCommands([new HelpCommand(), new VersionCommand(), new ImportCommand()]);

cli.run(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`${chalk.bold.red('Ошибка:')} ${chalk.red(message)}`);
  process.exitCode = 1;
});
