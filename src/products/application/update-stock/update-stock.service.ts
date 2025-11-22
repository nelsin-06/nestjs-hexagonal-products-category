import { Injectable, HttpStatus } from '@nestjs/common';
import { ProductRepository } from '@src/products/domain/ports/out/db/product.repository.port';
import { Product } from '@src/products/domain/entity/product';
import { BusinessException } from '@shared/domain/exceptions/business.exception';

@Injectable()
export class UpdateStockService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, stock: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new BusinessException('Product not found', HttpStatus.NOT_FOUND, {
        productId: id,
        reason: 'The product does not exist in the database',
      });
    }

    product.updateStock(stock);
    await this.productRepository.update(product);
    return product;
  }
}
