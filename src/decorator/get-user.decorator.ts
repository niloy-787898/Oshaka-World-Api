import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../interfaces/user/user.interface';
import { Vendor } from '../interfaces/user/vendor.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const GetVendor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Vendor => {
    const request = ctx.switchToHttp().getRequest();
    if(!request?.vendor){
      return null
    }

    return request.vendor;
  },
);
