import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const VendorPaymentSchema = new mongoose.Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    date: {
      type: Date,
      required: false,
    },
    dateString: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    paymentMethodId: {
      type: String,
      required: true,
    },
    paymentBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    status: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
