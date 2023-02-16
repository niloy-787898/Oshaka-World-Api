import { Vendor } from '../user/vendor.interface';
import { Admin } from '../admin/admin.interface';

export interface VendorPayment {
  _id?: string;
  vendor?: string | Vendor;
  date?: string;
  dateString?: string;
  amount?: number;
  paymentMethod?: string;
  paymentMethodId?: string;
  paymentBy?: string | Admin;
  status?: string; // "pending" / "accepted" / "not_accepted"
  createdAt?: Date;
  updatedAt?: Date;
}
