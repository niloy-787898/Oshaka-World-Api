import { Module } from '@nestjs/common';
import { CategoryMenuService } from './category-menu.service';
import { CategoryMenuController } from './category-menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryMenuSchema } from '../../../schema/category-menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CategoryMenu', schema: CategoryMenuSchema },
    ]),
  ],
  providers: [CategoryMenuService],
  controllers: [CategoryMenuController],
})
export class CategoryMenuModule {}
