import { Injectable } from '@nestjs/common';
import { InMemoryBaseRepository } from '@shared/infrastructure/adapters/out/db/in-memory-base.repository';
import { ProductRepository } from '@src/products/domain/ports/out/db/product.repository.port';
import { Product } from '@src/products/domain/entity/product';

@Injectable()
export class InMemoryProductRepository
  extends InMemoryBaseRepository<Product>
  implements ProductRepository
{
  constructor() {
    super();
    this.items = [
      new Product('1', 'Taza Cerámica', 'TAZ-001', 9.99, 50, true),
      new Product('2', 'Camisa Negra', 'CAM-NEG-002', 19.99, 15, true),
      new Product('3', 'Cuaderno A5', 'CUE-A5-003', 4.5, 0, false),
    ];
  }

  async findBySku(sku: string): Promise<Product | null> {
    // Método se mantiene async para cumplir contrato de la interfaz aunque sea sincrónico aquí.
    const item = this.items.find((p) => p.sku === sku);
    return Promise.resolve(item || null);
  }
}
