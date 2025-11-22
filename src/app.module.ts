import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   process.env.MONGO_URI ||
    //     'mongodb://root:password@localhost:27017/products_db?authSource=admin',
    // ),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
