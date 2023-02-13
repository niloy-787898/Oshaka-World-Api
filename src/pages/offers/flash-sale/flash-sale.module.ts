import { Module } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import { FlashSaleController } from './flash-sale.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashSaleSchema } from '../../../schema/flash-sale.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FlashSale', schema: FlashSaleSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [FlashSaleService],
  controllers: [FlashSaleController],
})
export class FlashSaleModule {}
