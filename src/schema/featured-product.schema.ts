import * as mongoose from 'mongoose';

export const FeaturedProductSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    priority: {
        type: Number,
        required: false
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
  },
  {
    versionKey: false,
    timestamps: true,
  },
);