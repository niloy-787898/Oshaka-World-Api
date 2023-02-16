import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtVendorStrategy } from './jwt-vendor.strategy';
import { PASSPORT_USER_TOKEN_TYPE } from '../../core/global-variables';
import { AddressSchema } from '../../schema/address.schema';
import { OtpService } from '../otp/otp.service';
import { OtpSchema } from '../../schema/otp.schema';
import { PromoOfferSchema } from '../../schema/promo-offer.schema';
import { ProductSchema } from '../../schema/product.schema';
import { VendorSchema } from '../../schema/vendor.scema';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: PASSPORT_USER_TOKEN_TYPE,
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
      { name: 'Vendor', schema: VendorSchema },
      { name: 'PromoOffer', schema: PromoOfferSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Otp', schema: OtpSchema },
      { name: 'Address', schema: AddressSchema },
    ]),
  ],
  controllers: [VendorController],
  providers: [VendorService, JwtVendorStrategy, OtpService],
  exports: [PassportModule],
})
export class VendorModule {}
