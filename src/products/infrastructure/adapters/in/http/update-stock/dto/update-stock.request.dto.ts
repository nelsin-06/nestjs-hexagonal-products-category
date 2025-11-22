import { IsNumber, Min } from 'class-validator';

export class UpdateStockRequestDto {
  @IsNumber()
  @Min(0)
  stock: number;
}
