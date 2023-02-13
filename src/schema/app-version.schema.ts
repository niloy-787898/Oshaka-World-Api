import * as mongoose from 'mongoose';

export const AppVersionSchema = new mongoose.Schema(
  {
    android: {
      type: String,
      required: false,
    },
    forceAndroid: {
      type: Boolean,
      required: false,
    },
    ios: {
      type: String,
      required: false,
    },
    forceIos: {
      type: Boolean,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
