export interface Repository<T> {
  create(data: T): Promise<T>;
  read(id: string): Promise<T | undefined>;
  read(): Promise<T[] | undefined>;
  update(id: string, data: Partial<T>): Promise<T | undefined>;
  delete(id: string): Promise<void>;
}
