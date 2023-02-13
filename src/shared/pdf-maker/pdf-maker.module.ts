import { Global, Module } from '@nestjs/common';
import { PdfMakerService } from './pdf-maker.service';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
    ]),
  ],
  providers: [PdfMakerService],
  exports: [PdfMakerService],
})
export class PdfMakerModule {}
