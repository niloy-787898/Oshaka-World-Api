import * as mongoose from 'mongoose';

export const StorySchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: 'youtube',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
