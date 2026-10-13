export interface FileWriter<T> {
  write(items: Iterable<T> | AsyncIterable<T>): Promise<void>;
}
