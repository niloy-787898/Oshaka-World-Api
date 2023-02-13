import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from '../../schema/user.schema';
import { JwtUserStrategy } from './jwt-user.strategy';
import { PASSPORT_USER_TOKEN_TYPE } from '../../core/global-variables';
import { AddressSchema } from '../../schema/address.schema';
import { OtpService } from '../otp/otp.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { OtpModule } from '../otp/otp.module';
import { OtpSchema } from '../../schema/otp.schema';
import { PromoOfferSchema } from '../../schema/promo-offer.schema';
import { PromoOfferModule } from '../offers/promo-offer/promo-offer.module';
import { ProductSchema } from '../../schema/product.schema';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: PASSPORT_USER_TOKEN_TYPE,
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('userJwtSecret'),
        signOptions: {
          expiresIn: configService.get<number>('userTokenExpiredTime'),
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'PromoOffer', schema: PromoOfferSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Otp', schema: OtpSchema },
      { name: 'Address', schema: AddressSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtUserStrategy, OtpService],
  exports: [PassportModule],
})
export class UserModule {}
