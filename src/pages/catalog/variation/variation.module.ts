import { Module } from '@nestjs/common';
import { VariationController } from './variation.controller';
import { VariationService } from './variation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../../../schema/product.schema';
import { VariationSchema } from '../../../schema/variation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Variation', schema: VariationSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [VariationController],
  providers: [VariationService],
})
export class VariationModule {}
