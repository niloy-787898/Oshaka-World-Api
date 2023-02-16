import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const VendorIdentificationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    nidCardNo: {
      type: String,
      required: true,
    },
    nidCardImageFront: {
      type: String,
      required: false,
    },
    nidCardImageBack: {
      type: String,
      required: false,
    },
    businessCardNo: {
      type: String,
      required: true,
    },
    businessCardImage: {
      type: String,
      required: false,
    },
    tradeLicenseNo: {
      type: String,
      required: true,
    },
    tradeLicenseImage: {
      type: String,
      required: false,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
    },
  },
  {
    timestamps: true,
  },
);
