import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsletterSchema } from '../../../schema/newsletter.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Newsletter', schema: NewsletterSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [NewsletterService],
  controllers: [NewsletterController],
})
export class NewsletterModule {}
