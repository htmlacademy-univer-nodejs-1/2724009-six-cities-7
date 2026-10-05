export type ParsedArgs = {
  command: string;
  args: string[];
};

export function parseArgs(argv: string[]): ParsedArgs {
  const [command = '--help', ...args] = argv;

  return { command, args };
}
