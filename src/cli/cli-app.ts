import type { CliCommand } from './commands/cli-command.interface.js';
import { parseArgs } from './parse-argv.js';

export class CliApp {
  private readonly commands = new Map<string, CliCommand>();

  public registerCommands(commands: CliCommand[]): void {
    for (const command of commands) {
      this.commands.set(command.name, command);
    }
  }

  public async run(argv: string[]): Promise<void> {
    const { command: commandName, args } = parseArgs(argv);
    const command = this.commands.get(commandName);

    if (!command) {
      throw new Error(`Неизвестная команда: ${commandName}`);
    }

    await command.run(...args);
  }
}
