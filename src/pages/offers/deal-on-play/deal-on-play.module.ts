import { Module } from '@nestjs/common';
import { DealOnPlayService } from './deal-on-play.service';
import { DealOnPlayController } from './deal-on-play.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DealOnPlaySchema } from '../../../schema/deal-on-play.shema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DealOnPlay', schema: DealOnPlaySchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [DealOnPlayService],
  controllers: [DealOnPlayController],
})
export class DealOnPlayModule {}
