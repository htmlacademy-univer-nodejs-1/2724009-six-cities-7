import { readFile } from 'node:fs/promises';
import chalk from 'chalk';
import type { CliCommand } from './cli-command.interface.js';

export class VersionCommand implements CliCommand {
  public readonly name = '--version';

  public async run(): Promise<void> {
    const packagePath = new URL('../../../package.json', import.meta.url);
    const packageContent = await readFile(packagePath, 'utf-8');
    const packageInfo: { version: string } = JSON.parse(packageContent);

    console.log(chalk.bold.green(packageInfo.version));
  }
}
