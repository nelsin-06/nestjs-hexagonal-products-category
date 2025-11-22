import { Product } from '@src/products/domain/entity/product';
import { ProductDocument } from '../schema/product.schema';

export class ProductMapper {
  static toDomain(document: ProductDocument): Product {
    return new Product(
      document._id,
      document.name,
      document.sku,
      document.price,
      document.stock,
      document.isActive,
    );
  }

  static toPersistence(entity: Product) {
    return {
      _id: entity.id,
      name: entity.name,
      sku: entity.sku,
      price: entity.price,
      stock: entity.stock,
      isActive: entity.isActive,
    };
  }
}
