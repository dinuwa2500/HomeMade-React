import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Provide name'],
    },
    email: {
      type: String,
      required: [true, 'Provide email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Provide password'],
    },
    avatar: {
      type: String,
      default: '',
    },
    mobile: {
      type: Number,
      default: null,
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: null,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
    address_details: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cartProduct',
      },
    ],
    orderHistoty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
      },
    ],
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER', 'DRIVER'], // ✅ added DRIVER role
      default: 'USER',
    },
  },
  {
    timestamps: true, // ✅ fixed typo
  }
);

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
