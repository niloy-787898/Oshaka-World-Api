import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppVersionController } from './app-version.controller';
import { AppVersionService } from './app-version.service';
import { AppVersionSchema } from '../../schema/app-version.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AppVersion', schema: AppVersionSchema },
    ]),
  ],
  controllers: [AppVersionController],
  providers: [AppVersionService],
})
export class AppVersionModule {}
