import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProductService } from '@src/products/application/create-product/create-product.service';
import { CreateProductRequestDto } from './dto/create-product.request.dto';
import { ProductResponseDto } from '../find-products/dto/product.response.dto';
import { ApiKeyGuard } from '@shared/infrastructure/guards/api-key.guard';

@Controller('products')
export class CreateProductController {
  constructor(private readonly createProductService: CreateProductService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const product = await this.createProductService.execute(
      dto.name,
      dto.sku,
      dto.price,
      dto.stock,
    );
    return new ProductResponseDto(product);
  }
}
