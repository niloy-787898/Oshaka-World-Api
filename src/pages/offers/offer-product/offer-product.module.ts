import { Module } from '@nestjs/common';
import { OfferProductService } from './offer-product.service';
import { OfferProductController } from './offer-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OfferProductSchema } from '../../../schema/offer-product.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OfferProduct', schema: OfferProductSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [OfferProductService],
  controllers: [OfferProductController],
})
export class OfferProductModule {}
