export interface FileReader<T> {
  read(): AsyncIterable<T>;
}
