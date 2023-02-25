import * as mongoose from 'mongoose';
import { ORDER_ITEM_SCHEMA } from './sub-schema.schema';
import { Schema } from 'mongoose';

export const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: false,
    },
    
    email: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    district: {
      type: String,
      required: false,
    },
    thana: {
      type: String,
      required: false,
    },
    shippingAddress: {
      type: String,
      required: false,
    },
    paymentType: {
      type: String,
      required: false,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    orderedItems: [ORDER_ITEM_SCHEMA],
    subTotal: {
      type: Number,
      required: true,
    },
    vendors: [{
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: false
    }],
    deliveryCharge: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    totalSave: {
      type: Number,
      required: false,
    },
    productDiscount: {
      type: Number,
      required: false,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    discountTypes: {
      type: [Object],
      required: false,
    },
    checkoutDate: {
      type: String,
      required: false,
    },
    deliveryDate: {
      type: Date,
      required: false,
    },
    deliveryDateString: {
      type: String,
      required: false,
    },
    orderStatus: {
      type: Number,
      required: true,
    },
    hasOrderTimeline: {
      type: Boolean,
      required: false,
    },
    orderTimeline: {
      type: Object,
      required: false,
    },
    processingDate: {
      type: Date,
      required: false,
    },
    shippingDate: {
      type: Date,
      required: false,
    },
    deliveringDate: {
      type: Date,
      required: false,
    },
    preferredDate: {
      type: Date,
      required: false,
    },
    preferredTime: {
      type: String,
      required: false,
    },
    note: {
      type: String,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      required: false,
    },
    couponDiscount: {
      type: Number,
      required: false,
    },
    deliveringDateAdmin: {
      type: Date,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
