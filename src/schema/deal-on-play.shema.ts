import * as mongoose from 'mongoose';

export const DealOnPlaySchema = new mongoose.Schema(
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
    priority: {
        type: Number,
        required: false
    },
    shortDesc: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    routerLink: {
        type: String,
        required: false
    },
    cardBackground: {
        type: String,
        required: false
    },
    cardBtnColor: {
        type: String,
        required: false
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
  },
  {
    versionKey: false,
    timestamps: true,
  },
);