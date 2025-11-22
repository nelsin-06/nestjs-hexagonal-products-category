import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductRepository } from '@src/products/domain/ports/out/db/product.repository.port';
import { Product } from '@src/products/domain/entity/product';
import { ProductDocument, ProductSchemaClass } from './schema/product.schema';
import { ProductMapper } from './mapper/product.mapper';
import { MongoBaseRepository } from '@shared/infrastructure/adapters/out/db/mongo/mongo-base.repository';

@Injectable()
export class MongoProductRepository
  extends MongoBaseRepository<Product, ProductDocument>
  implements ProductRepository, OnModuleInit
{
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  protected mapToDomain(doc: ProductDocument): Product {
    return ProductMapper.toDomain(doc);
  }

  protected mapToPersistence(entity: Product): Record<string, any> {
    return ProductMapper.toPersistence(entity);
  }

  async onModuleInit() {
    const count = await this.productModel.countDocuments();
    if (count === 0) {
      await this.productModel.insertMany([
        {
          _id: '1',
          name: 'Taza Cerámica',
          sku: 'TAZ-001',
          price: 9.99,
          stock: 50,
          isActive: true,
        },
        {
          _id: '2',
          name: 'Camisa Negra',
          sku: 'CAM-NEG-002',
          price: 19.99,
          stock: 15,
          isActive: true,
        },
        {
          _id: '3',
          name: 'Cuaderno A5',
          sku: 'CUE-A5-003',
          price: 4.5,
          stock: 0,
          isActive: false,
        },
      ]);
    }
  }

  async findBySku(sku: string): Promise<Product | null> {
    const doc = await this.productModel.findOne({ sku }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }
}
