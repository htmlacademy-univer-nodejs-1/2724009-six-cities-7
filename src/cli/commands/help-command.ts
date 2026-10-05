import chalk from 'chalk';
import type { CliCommand } from './cli-command.interface.js';

export class HelpCommand implements CliCommand {
  public readonly name = '--help';

  public async run(): Promise<void> {
    console.log(`
${chalk.bold.magenta('Шесть городов — CLI')}
${chalk.gray('Программа для подготовки данных для сервера «Шесть городов».')}

${chalk.bold.yellow('Использование:')}
  ${chalk.cyan('npm run cli -- <command> [arguments]')}

${chalk.bold.yellow('Команды:')}
  ${chalk.cyan('--help'.padEnd(28))}Показывает справку
  ${chalk.cyan('--version'.padEnd(28))}Показывает версию приложения
  ${chalk.cyan('--import <path>'.padEnd(28))}Импортирует предложения из TSV
  ${chalk.cyan('--generate <n> <path> <url>'.padEnd(28))}Генерирует данные ${chalk.gray('(следующее задание)')}

${chalk.bold.yellow('Пример:')}
  ${chalk.cyan('npm run cli -- --import')} ${chalk.yellow('mocks/offers.tsv')}
`);
  }
}
