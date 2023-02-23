import { Coupon } from '../common/coupon.interface';
import { Cart } from '../common/cart.interface';
import { Order } from '../common/order.interface';
import { Address } from '../common/address';
import { VendorPayment } from '../common/vendor-payment';
import { VendorIdentification } from '../common/vendor-identification';

export interface Vendor {
  _id?: string;
  vendorName: string;
  vendorSlug: string;
  vendorType: number;
  shopName: string;
  shopSlug: string;
  shopArea: string;
  shopZone: string;
  address: string;
  phoneNo: string;
  email: string;
  shortDescription?: string;
  rating?: number;
  termsAndConditions?: string;
  username: string;
  password: string;
  hasVendorAccess: boolean;
  approved: boolean;
  profileImg?: string;
  shopLogo?: string;
  vendorPriority?: number;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  previousPaymentType: string;
  paymentReceiveType: string;
  paymentServiceName?: string;
  paymentServiceNo?: string;
  dueAmount?: number;
  totalAmount?: number;
  receivedAmount?: number;
  payments?: string[] | VendorPayment[];
  createdAt?: Date;
  updatedAt?: Date;
  vendorIdentification?: VendorIdentification| string;
}

export interface VendorAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredIn?: number;
  data?: any;
  message?: string;
}

export interface VendorJwtPayload {
  _id?: string;
  vendorName: string;
}
