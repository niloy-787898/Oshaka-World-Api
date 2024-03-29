import { Module } from '@nestjs/common';
import { StoreInfoService } from './store-info.service';
import { StoreInfoController } from './store-info.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreInfoSchema } from '../../../schema/store-info.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StoreInfo', schema: StoreInfoSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [StoreInfoService],
  controllers: [StoreInfoController],
})
export class StoreInfoModule {}
