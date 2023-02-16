import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const VendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      required: false,
    },
    shopLogo: {
      type: String,
      required: false,
    },
    shopBanner: {
      type: String,
      required: false,
    },
    offerBanner: {
      type: String,
      required: false,
    },
    vendorSlug: {
      type: String,
      required: true,
    },
    vendorType: {
      type: Number,
      required: true,
    },
    vendorPriority: {
      type: Number,
      required: true,
    },
    shopArea: {
      type: String,
      required: false,
    },
    shopZone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    shortDescription: {
      type: String,
      required: false,
    },
    termsAndConditions: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    shopName: {
      type: String,
      required: true,
    },
    shopSlug: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hasAccess: {
      type: Boolean,
      required: false,
    },
    approved: {
      type: Boolean,
      required: false,
    },
    isPhoneVerified: {
      type: Boolean,
      required: false,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    previousPaymentType: {
      type: String,
      required: false,
    },
    paymentReceiveType: {
      type: String,
      required: true,
    },
    paymentServiceName: {
      type: String,
      required: false,
    },
    paymentServiceNo: {
      type: String,
      required: false,
    },
    dueAmount: {
      type: Number,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    receivedAmount: {
      type: Number,
      required: false,
    },
    vendorIdentification: {
      type: Schema.Types.ObjectId,
      ref: 'VendorIdentification',
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'VendorPayment',
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  },
);
