import { Module } from '@nestjs/common';
import { VandorPaymentService } from './vandor-payment.service';
import { VandorPaymentController } from './vandor-payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorPaymentSchema } from '../../../schema/vendor-payment.scema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VandorPayment', schema: VendorPaymentSchema },
    ]),
  ],
  providers: [VandorPaymentService],
  controllers: [VandorPaymentController],
})
export class VandorPaymentModule {}
