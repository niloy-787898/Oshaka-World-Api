import {Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {VendorIdentificationController} from './vendor-identification.controller';
import {VendorIdentificationService} from './vendor-identification.service';
import {VendorSchema} from "../../schema/vendor.scema";
import {VendorIdentificationSchema} from "../../schema/vendor-identification.scema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VendorIdentification', schema: VendorIdentificationSchema },
      { name: 'Vendor', schema: VendorSchema },
    ]),
  ],
  controllers: [VendorIdentificationController],
  providers: [VendorIdentificationService],
})
export class VendorIdentificationModule {}
