import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUsSchema } from '../../../schema/contact-us.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ContactUs', schema: ContactUsSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [ContactUsService],
  controllers: [ContactUsController],
})
export class ContactUsModule {}
