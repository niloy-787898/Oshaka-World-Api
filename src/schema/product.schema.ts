import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import {
  PRODUCT_VARIATION_OPTION_SCHEMA,
  VARIATION_SUB_SCHEMA,
} from './sub-schema.schema';

export const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: false,
    },
    hasTax: {
      type: Boolean,
      required: false,
    },
    sku: {
      type: String,
      required: false,
      unique: true,
    },
    emiMonth: {
      type: [Number],
      required: false,
    },
    discountType: {
      type: Number,
      required: false,
    },
    discountAmount: {
      type: Number,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
      default: 0,
    },
    trackQuantity: {
      type: Boolean,
      required: false,
    },
    seoTitle: {
      type: String,
      required: false,
    },
    seoDescription: {
      type: String,
      required: false,
    },
    seoKeywords: {
      type: String,
      required: false,
    },
    category: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
      },
    },
    subCategory: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
      },
    },
    brand: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
      },
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag',
      required: false,
    },
    hasVariations: {
      type: Boolean,
      required: false,
    },
    variations: {
      type: [VARIATION_SUB_SCHEMA],
      required: false,
    },
    variationsOptions: [
      {
        quantity: {
          type: Number,
          required: false,
        },
        price: {
          type: Number,
          required: false,
        },
        image: {
          type: String,
          required: false,
        },
        variations: [PRODUCT_VARIATION_OPTION_SCHEMA],
      },
    ],
    earnPoint: {
      type: Boolean,
      required: false,
    },
    pointType: {
      type: Number,
      required: false,
    },
    pointValue: {
      type: Number,
      required: false,
    },
    redeemPoint: {
      type: Boolean,
      required: false,
    },
    redeemType: {
      type: Number,
      required: false,
    },
    redeemValue: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    discountStartDateTime: {
      type: Date,
      required: false,
    },
    discountEndDateTime: {
      type: Date,
      required: false,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    unit: {
      type: String,
      required: false,
    },
    specifications: {
      type: [Object],
      required: false,
    },
    totalSold: {
      type: Number,
      required: false,
      default: 0,
    },
    ratingAvr: {
      type: Number,
      required: false,
      default: 0,
    },
    ratingCount: {
      type: Number,
      required: false,
      default: 0,
    },
    ratingTotal: {
      type: Number,
      required: false,
      default: 0,
    },
    reviewTotal: {
      type: Number,
      required: false,
      default: 0,
    },
    createdAtString: {
      type: String,
      required: false,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor'
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
