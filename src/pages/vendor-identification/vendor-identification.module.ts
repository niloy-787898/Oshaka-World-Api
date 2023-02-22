import {Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {VendorIdentificationController} from './vendor-identification.controller';
import {VendorIdentificationService} from './vendor-identification.service';
import {VendorSchema} from "../../schema/vendor.scema";
import {VendorIdentificationSchema} from "../../schema/vendor-identification.scema";
import { PassportModule } from '@nestjs/passport';
import { PASSPORT_VENDOR_TOKEN_TYPE } from 'src/core/global-variables';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: PASSPORT_VENDOR_TOKEN_TYPE,
      property: 'vendor',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('vendorJwtSecret'),
        signOptions: {
          expiresIn: configService.get<number>('vendorTokenExpiredTime'),
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: 'VendorIdentification', schema: VendorIdentificationSchema },
      { name: 'Vendor', schema: VendorSchema },
    ]),
  ],
  controllers: [VendorIdentificationController],
  providers: [VendorIdentificationService],
})
export class VendorIdentificationModule {}
