import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';

export const AddressSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        addressType: {
            type: String,
            required: false,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
