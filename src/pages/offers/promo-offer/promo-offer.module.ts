import { Module } from '@nestjs/common';
import { PromoOfferController } from './promo-offer.controller';
import { PromoOfferService } from './promo-offer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../../../schema/product.schema';
import { PromoOfferSchema } from '../../../schema/promo-offer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PromoOffer', schema: PromoOfferSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [PromoOfferController],
  providers: [PromoOfferService],
})
export class PromoOfferModule {}
