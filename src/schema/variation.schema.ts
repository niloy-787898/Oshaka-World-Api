import * as mongoose from 'mongoose';

export const VariationSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    values: {
      type: [String],
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
