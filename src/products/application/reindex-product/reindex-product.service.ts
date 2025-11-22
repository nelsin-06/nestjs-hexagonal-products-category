import { Injectable } from '@nestjs/common';
import { IndexingPort } from '../../domain/ports/out/external/indexing.port';

@Injectable()
export class ReindexProductService {
  constructor(private readonly indexingPort: IndexingPort) {}

  async execute(id: string): Promise<void> {
    await this.indexingPort.reindexProduct(id);
  }
}
