import { Module } from '@nestjs/common';
import { FeaturedProductService } from './featured-product.service';
import { FeaturedProductController } from './featured-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FeaturedProductSchema } from '../../../schema/featured-product.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FeaturedProduct', schema: FeaturedProductSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [FeaturedProductService],
  controllers: [FeaturedProductController],
})
export class FeaturedProductModule {}
