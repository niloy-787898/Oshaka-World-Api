import * as mongoose from 'mongoose';

export const FooterDataSchema = new mongoose.Schema({
  readOnly: {
    type: Boolean,
    required: false,
  },
  shortDes: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  aboutEsquire: {
    type: String,
    required: false,
  },
  title1: {
    type: String,
    required: false,
  },
  title1Des: {
    type: String,
    required: false,
  },
  title2: {
    type: String,
    required: false,
  },
  title2Des: {
    type: String,
    required: false,
  },
  title3: {
    type: String,
    required: false,
  },
  title3Des: {
    type: String,
    required: false,
  },
  title4: {
    type: String,
    required: false,
  },
  title4Des: {
    type: String,
    required: false,
  },
  title5: {
    type: String,
    required: false,
  },
  title5Des: {
    type: String,
    required: false,
  },
  socialLinks: [
    {
      type: Object,
      required: false,
    },
  ],
});
