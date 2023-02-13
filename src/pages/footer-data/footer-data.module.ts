import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductSchema } from '../../schema/product.schema';
import { FooterDataController } from './footer-data.controller';
import { FooterDataService } from './footer-data.service';
import { FooterDataSchema } from '../../schema/footer-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FooterData', schema: FooterDataSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [FooterDataController],
  providers: [FooterDataService],
})
export class FooterDataModule {}
