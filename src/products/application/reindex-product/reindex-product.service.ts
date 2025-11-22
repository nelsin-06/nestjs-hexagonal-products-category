import { Injectable, HttpStatus } from '@nestjs/common';
import { IndexingPort } from '../../domain/ports/out/external/indexing.port';
import { ProductRepository } from '@src/products/domain/ports/out/db/product.repository.port';
import { BusinessException } from '@shared/domain/exceptions/business.exception';

@Injectable()
export class ReindexProductService {
  constructor(
    private readonly indexingPort: IndexingPort,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new BusinessException('Product not found', HttpStatus.NOT_FOUND, {
        productId: id,
        reason: 'Cannot reindex a non-existent product',
      });
    }
    await this.indexingPort.reindexProduct(id);
  }
}
