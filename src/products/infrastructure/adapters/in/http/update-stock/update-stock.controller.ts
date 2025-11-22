import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateStockService } from '../../../../../application/update-stock/update-stock.service';
import { UpdateStockRequestDto } from './dto/update-stock.request.dto';
import { ProductResponseDto } from '../find-products/dto/product.response.dto';
import { ApiKeyGuard } from '../../../../../../shared/infrastructure/guards/api-key.guard';

@Controller('products')
export class UpdateStockController {
  constructor(private readonly updateStockService: UpdateStockService) {}

  @Patch(':id/stock')
  @UseGuards(ApiKeyGuard)
  async updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateStockRequestDto,
  ): Promise<ProductResponseDto> {
    //TODO: TODAS LAS RESPONSEDTO DEBERIAN DE EXTENDER DE UNA INTERFAZ PRINCIPAL, ASI PUEDO ENVIAR DIFERENTES TIPOS SIN PREOCUPARME DEL RETURN
    const product = await this.updateStockService.execute(id, dto.stock);
    return new ProductResponseDto(product);
  }
}
