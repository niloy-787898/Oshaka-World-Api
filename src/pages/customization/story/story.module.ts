import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StorySchema } from '../../../schema/story.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Story', schema: StorySchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [StoryService],
  controllers: [StoryController],
})
export class StoryModule {}
