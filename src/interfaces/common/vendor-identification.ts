import { Vendor } from '../user/vendor.interface';

export interface VendorIdentification {
  _id?: string;
  vendorName:string,
  idType: string;
  fullName?: string;
  nidCardNo: string;
  nidCardImageFront: string;
  nidCardImageBack: string;
  businessCardImage: string;
  businessCardNo: string;
  tradeLicenseNo: string;
  tradeLicenseImage: string;
  vendorId: string;
  vendor: string | Vendor;
}
