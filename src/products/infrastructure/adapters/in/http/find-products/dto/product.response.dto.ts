import { Product } from '../../../../../../domain/entity/product';

export class ProductResponseDto {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.sku = product.sku;
    this.price = product.price;
    this.stock = product.stock;
    this.isActive = product.isActive;
  }
}
