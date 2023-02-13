import { Module } from '@nestjs/common';
import { DealsOfTheDayService } from './deals-of-the-day.service';
import { DealsOfTheDayController } from './deals-of-the-day.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DealsOfTheDaySchema } from '../../../schema/deals-of-the-day.shema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DealsOfTheDay', schema: DealsOfTheDaySchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [DealsOfTheDayService],
  controllers: [DealsOfTheDayController],
})
export class DealsOfTheDayModule {}
