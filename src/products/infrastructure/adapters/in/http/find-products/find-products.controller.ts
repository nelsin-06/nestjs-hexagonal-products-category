import { Controller, Get } from '@nestjs/common';
import { FindProductsService } from '../../../../../application/find-products/find-products.service';
import { ProductResponseDto } from './dto/product.response.dto';

@Controller('products')
export class FindProductsController {
  constructor(private readonly findProductsService: FindProductsService) {}

  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.findProductsService.execute();
    return products.map((product) => new ProductResponseDto(product));
  }
}
