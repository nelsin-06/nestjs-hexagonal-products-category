import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateProductController } from './infrastructure/adapters/in/http/create-product/create-product.controller';
import { FindProductsController } from './infrastructure/adapters/in/http/find-products/find-products.controller';
import { UpdateStockController } from './infrastructure/adapters/in/http/update-stock/update-stock.controller';
import { ReindexProductController } from './infrastructure/adapters/in/http/reindex-product/reindex-product.controller';
import { CreateProductService } from './application/create-product/create-product.service';
import { FindProductsService } from './application/find-products/find-products.service';
import { UpdateStockService } from './application/update-stock/update-stock.service';
import { ReindexProductService } from './application/reindex-product/reindex-product.service';
import { ProductRepository } from './domain/ports/out/db/product.repository.port';
import {
  ProductSchema,
  ProductSchemaClass,
} from './infrastructure/adapters/out/db/mongo/schema/product.schema';
import { IndexingPort } from './domain/ports/out/external/indexing.port';
import { ExternalIndexingAdapter } from './infrastructure/adapters/out/external/external-indexing.adapter';
import { InMemoryProductRepository } from './infrastructure/adapters/out/db/in-memory-product.repository';
import { MongoProductRepository } from './infrastructure/adapters/out/db/mongo/mongo-product.repository';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: ProductSchemaClass.name, schema: ProductSchema },
    // ]),
  ],
  controllers: [
    CreateProductController,
    FindProductsController,
    UpdateStockController,
    ReindexProductController,
  ],
  providers: [
    CreateProductService,
    FindProductsService,
    UpdateStockService,
    ReindexProductService,
    {
      provide: ProductRepository,
      useClass: InMemoryProductRepository, // MongoProductRepository
    },
    {
      provide: IndexingPort,
      useClass: ExternalIndexingAdapter,
    },
  ],
})
export class ProductsModule {}
