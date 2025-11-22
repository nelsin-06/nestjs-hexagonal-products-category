import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ReindexProductService } from '@src/products/application/reindex-product/reindex-product.service';

@Controller('products')
export class ReindexProductController {
  constructor(private readonly reindexProductService: ReindexProductService) {}

  @Post(':id/reindex')
  @HttpCode(HttpStatus.ACCEPTED)
  async reindex(@Param('id') id: string) {
    await this.reindexProductService.execute(id); // Fire and forget
    return { message: 'Reindexing started' };
  }
}
