import chalk from 'chalk';

export function formatJson(value: unknown): string {
  const json = JSON.stringify(value, null, 2);

  if (json === undefined) {
    return chalk.gray('undefined');
  }

  const tokens = /"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

  return json.replace(tokens, (token: string, offset: number) => {
    if (token.startsWith('"')) {
      const isKey = json[offset + token.length] === ':';

      return isKey ? chalk.cyan(token) : chalk.green(token);
    }

    if (token === 'true' || token === 'false') {
      return chalk.magenta(token);
    }

    if (token === 'null') {
      return chalk.gray(token);
    }

    return chalk.yellow(token);
  });
}
