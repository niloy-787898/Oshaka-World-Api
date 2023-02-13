import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingSchema } from '../../schema/setting.schema';
import { ProductSchema } from '../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Setting', schema: SettingSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
