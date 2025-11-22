import { BaseRepository } from '../../../../domain/ports/out/db/base.repository.port';

export abstract class InMemoryBaseRepository<T extends { id: string }>
  implements BaseRepository<T>
{
  protected items: T[] = [];

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async findById(id: string): Promise<T | null> {
    const item = this.items.find((item) => item.id === id);
    return item || null;
  }

  async save(entity: T): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: T): Promise<void> {
    const index = this.items.findIndex((item) => item.id === entity.id);
    if (index !== -1) {
      this.items[index] = entity;
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
