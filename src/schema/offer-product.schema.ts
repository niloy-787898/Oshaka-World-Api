import * as mongoose from 'mongoose';

export const OfferProductSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: false
    },
    promotionalOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PromotionalOffer',
        required: true
    },
    promotionalOfferSlug: {
        type: String,
        required: false
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]},
  {
    versionKey: false,
    timestamps: true,
  },
);