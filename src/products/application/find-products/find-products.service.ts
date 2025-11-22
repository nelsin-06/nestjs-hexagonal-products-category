import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/ports/out/db/product.repository.port';
import { Product } from '../../domain/entity/product';

@Injectable()
export class FindProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
