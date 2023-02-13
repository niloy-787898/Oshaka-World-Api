import { Global, Module } from '@nestjs/common';
import { DbToolsService } from './db-tools.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoOfferSchema } from '../../schema/promo-offer.schema';
import { ProductSchema } from '../../schema/product.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PromoOffer', schema: PromoOfferSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [DbToolsService],
  exports: [DbToolsService],
})
export class DbToolsModule {}
