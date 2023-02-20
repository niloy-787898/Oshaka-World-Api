import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VendorJwtPayload } from '../../interfaces/user/user.interface';
import {
  PASSPORT_VENDOR_TOKEN_TYPE,
} from '../../core/global-variables';

@Injectable()
export class JwtVendorStrategy extends PassportStrategy(
  Strategy,
  PASSPORT_VENDOR_TOKEN_TYPE,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('vendorJwtSecret'),
    });
  }

  async validate(payload: VendorJwtPayload) {
    return { _id: payload._id, vendorName: payload.vendorName };
  }
}
