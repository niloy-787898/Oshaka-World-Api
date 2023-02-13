import { Coupon } from '../common/coupon.interface';
import { Cart } from '../common/cart.interface';
import { Order } from '../common/order.interface';
import { Address } from '../common/address';

export interface User {
  _id?: string;
  fullName: string;
  name?: string;
  username?: string;
  gender?: string;
  birthdate?: Date;
  email?: string;
  phoneNo?: string;
  address?: string;
  profileImg?: string;
  password?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  registrationType?: string;
  registrationAt?: Date;
  hasAccess?: boolean;
  usedCoupons?: Coupon[] | string[];
  wishlists?: string[];
  carts?: Cart[] | string[];
  checkouts?: Order[] | string[];
  addresses?: Address[] | string[];
  createdAt?: any;
  updatedAt?: any;
  success: boolean;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredIn?: number;
  data?: any;
  message?: string;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
}
