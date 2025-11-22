import { BaseRepository } from '@shared/domain/ports/out/db/base.repository.port';
import { Product } from '@src/products/domain/entity/product';

export abstract class ProductRepository extends BaseRepository<Product> {
  abstract findBySku(sku: string): Promise<Product | null>;
}
