import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
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
    gender: {
      type: String,
      required: false,
    },
    profileImg: {
      type: String,
    },
    registrationType: {
      type: String,
      required: false,
    },
    hasAccess: {
      type: Boolean,
      required: true,
    },
    carts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
      },
    ],
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: false,
      },
    ],
    usedCoupons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
      },
    ],

    fullName: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },

    birthdate: {
      type: Date,
      required: false,
    },

    isPhoneVerified: {
      type: Boolean,
      required: false,
    },
    isEmailVerified: {
      type: Boolean,
      required: false,
    },

    registrationAt: {
      type: Date,
      default: Date.now(),
      required: true,
    },

    wishlists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    checkouts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },

  {
    versionKey: false,
    timestamps: true,
  },
);
