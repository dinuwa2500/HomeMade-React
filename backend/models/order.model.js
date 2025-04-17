import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // should match your user model name
      required: true,
    },
    orderId: {
      type: String,
      required: [true, 'Provide orderId'],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    product_details: {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: [String],
        default: [],
      },
    },
    paymentId: {
      type: String,
      default: '',
    },
    payment_status: {
      type: String,
      default: '',
    },
    delivery_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'address',
      required: true,
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
  
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('order', orderSchema);
export default Order;
