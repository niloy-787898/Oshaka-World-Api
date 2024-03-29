import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PASSPORT_VENDOR_TOKEN_TYPE } from '../core/global-variables';

@Injectable()
export class VendorJwtAuthGuard extends AuthGuard(PASSPORT_VENDOR_TOKEN_TYPE) {
  
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, vendor, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !vendor) {
      throw err || new UnauthorizedException();
    }
    return vendor;
  }
}
