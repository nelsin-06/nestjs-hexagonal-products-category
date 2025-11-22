import { HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository } from '@src/products/domain/ports/out/db/product.repository.port';
import { Product } from '@src/products/domain/entity/product';
import { BusinessException } from '@shared/domain/exceptions/business.exception';

@Injectable()
export class CreateProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    name: string,
    sku: string,
    price: number,
    stock: number, // TODO: IMPLEMENTAR UNA INTERFACE
  ): Promise<Product> {
    const existing = await this.productRepository.findBySku(sku);
    if (existing) {
      throw new BusinessException(
        'Product with SKU ${sku} already exists',
        HttpStatus.CONFLICT,
        {
          sku: sku,
          reason: `Product with SKU ${sku} already exists ${sku}`,
        },
      );
    }

    const id = Math.random().toString(36).substring(7);
    const product = Product.create(id, name, sku, price, stock);
    await this.productRepository.save(product);
    return product;
  }
}
