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
  ${chalk.cyan('--import <path> <mongodb-uri>'.padEnd(28))}Сохраняет предложения из TSV в MongoDB
  ${chalk.cyan('--generate <n> <path> <url>'.padEnd(28))}Генерирует предложения в TSV

${chalk.bold.yellow('Пример:')}
  ${chalk.cyan('npm run cli -- --import')} ${chalk.yellow('mocks/offers.tsv "mongodb://admin:PASSWORD@127.0.0.1:27017/six-cities?authSource=admin"')}
  ${chalk.cyan('npm run cli -- --generate')} ${chalk.yellow('5 generated/offers.tsv http://127.0.0.1:3000/data')}

${chalk.gray('Для импорта задайте SALT в .env или переменных окружения. Замените PASSWORD паролем MongoDB.')}
`);
  }
}
