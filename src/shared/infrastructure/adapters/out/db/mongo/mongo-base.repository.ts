import { Model, Document } from 'mongoose';
import { BaseRepository } from '@shared/domain/ports/out/db/base.repository.port';

export abstract class MongoBaseRepository<
  DomainEntity extends { id: string },
  MongoDoc extends Document,
> implements BaseRepository<DomainEntity>
{
  constructor(protected readonly model: Model<MongoDoc>) {}

  protected abstract mapToDomain(doc: MongoDoc): DomainEntity;
  protected abstract mapToPersistence(
    entity: DomainEntity,
  ): Record<string, any>;

  async findAll(): Promise<DomainEntity[]> {
    const docs = await this.model.find().exec();
    return docs.map((doc) => this.mapToDomain(doc));
  }

  async findById(id: string): Promise<DomainEntity | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async save(entity: DomainEntity): Promise<void> {
    const persistenceData = this.mapToPersistence(entity);
    const created = new this.model(persistenceData);
    await created.save();
  }

  async update(entity: DomainEntity): Promise<void> {
    const persistenceData = this.mapToPersistence(entity);
    await this.model
      .findByIdAndUpdate(entity.id, persistenceData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
