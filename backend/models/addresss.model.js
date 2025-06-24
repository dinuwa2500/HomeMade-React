import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    address_line: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      default: '',
    },
    state: {
      type: String,
      required: true,
      default: '',
    },
    pincode: {
      type: String,
      required: true,
      default: '',
    },
    country: {
      type: String,
    },

    mobile: {
      type: Number,
      default: null,
    },

    status: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      default: '',
    },
  },

  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model('address', addressSchema);
export default AddressModel;
