import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { COURSE_MODULE_SCHEMA } from './sub-schema.schema';

export const CourseSchema = new mongoose.Schema(
  {
    title: {
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
    learningScopes: {
      type: [String],
      required: false,
    },
    benefits: {
      type: [String],
      required: false,
    },
    opportunities: {
      type: [String],
      required: false,
    },

    courseModules: [COURSE_MODULE_SCHEMA],
    price: {
      type: Number,
      required: true,
    },
    discountType: {
      type: Number,
      required: false,
    },
    discountAmount: {
      type: Number,
      required: false,
    },
    bannerImage: {
      type: String,
      required: false,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    totalDuration: {
      type: String,
      required: false,
    },
    totalUsers: {
      type: String,
      required: false,
    },
    totalExam: {
      type: String,
      required: false,
    },
    totalClass: {
      type: String,
      required: false,
    },
    enrolledUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
    ],
    category: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'CourseCategory',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    technologies: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Technology',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    tag: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    instructorName: {
      type: String,
      required: false,
    },
    instructorInfo: {
      type: String,
      required: false,
    },
    instructorImage: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
