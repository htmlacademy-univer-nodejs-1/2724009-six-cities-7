export interface CliCommand {
  readonly name: string;
  run(...args: string[]): Promise<void>;
}
