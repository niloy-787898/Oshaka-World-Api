import { Module } from '@nestjs/common';
import { PopupService } from './popup.service';
import { PopupController } from './popup.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PopupSchema } from '../../../schema/popup.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Popup', schema: PopupSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [PopupService],
  controllers: [PopupController],
})
export class PopupModule {}
