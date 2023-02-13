import * as mongoose from 'mongoose';

export const DealsOfTheDaySchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
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