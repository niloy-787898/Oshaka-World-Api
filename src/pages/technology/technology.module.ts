import { Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { TechnologyController } from './technology.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologySchema } from '../../schema/technology.schema';
import { UserSchema } from '../../schema/user.schema';
import { CourseSchema } from '../../schema/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Technology', schema: TechnologySchema },
      { name: 'User', schema: UserSchema },
      { name: 'Course', schema: CourseSchema },
    ]),
  ],
  providers: [TechnologyService],
  controllers: [TechnologyController],
})
export class TechnologyModule {}
