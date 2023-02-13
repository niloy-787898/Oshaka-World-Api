import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';

export const SubCategorySchema = new mongoose.Schema(
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
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: false,
        },
        priority: {
            type: Number,
            required: false,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        status: {
            type: String,
            required: false,
            default: 'publish'
        }
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
