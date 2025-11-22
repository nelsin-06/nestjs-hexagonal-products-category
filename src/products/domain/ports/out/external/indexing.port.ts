export abstract class IndexingPort {
  abstract reindexProduct(productId: string): Promise<void>;
}
