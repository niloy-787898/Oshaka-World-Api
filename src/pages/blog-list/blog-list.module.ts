import { Module } from '@nestjs/common';
import { BlogListService } from './blog-list.service';
import { BlogListController } from './blog-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogListSchema } from '../../schema/blog-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BlogList', schema: BlogListSchema },
    ]),
  ],
  providers: [BlogListService],
  controllers: [BlogListController],
})
export class BlogListModule {}
