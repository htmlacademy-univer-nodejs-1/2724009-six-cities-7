type MongoConnectionOptions = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

export function getMongoURI(options: MongoConnectionOptions): string {
  const { host, port, database, username, password } = options;
  const hostname = host.includes(':') ? `[${host}]` : host;

  return `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${hostname}:${port}/${encodeURIComponent(database)}?authSource=admin`;
}
