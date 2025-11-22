export abstract class BaseRepository<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<void>;
  abstract update(entity: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
