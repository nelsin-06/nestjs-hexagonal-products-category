import { Injectable, Logger } from '@nestjs/common';
import { IndexingPort } from '@src/products/domain/ports/out/external/indexing.port';

@Injectable()
export class ExternalIndexingAdapter implements IndexingPort {
  private readonly logger = new Logger(ExternalIndexingAdapter.name);

  async reindexProduct(productId: string): Promise<void> {
    // Simulate external service call latency
    const promise = new Promise((resolve) => setTimeout(resolve, 3000));
    await promise;

    this.logger.log(`Simulated external reindex for product ${productId}`);
  }
}
