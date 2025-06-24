import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    orderId: {
      type: String,
      required: [true, 'Provide orderId'],
      unique: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        name: String,
        image: [String],
        size: String,
        qty: Number,
        price: Number,
      }
    ],
    paymentId: {
      type: String,
      default: '',
    },
    payment_status: {
      type: String,
      default: '',
    },
    delivery_address: {
      type: String,
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
    status: {
      type: String,
      enum: ['pending_payment', 'to_delivery', 'delivering', 'delivered', 'cancelled'],
      default: 'pending_payment',
    },
    paymentSlipUploaded: {
      type: Boolean,
      default: false,
    },
    paymentSlip: {
      type: String,
      default: '',
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('order', orderSchema);
export default Order;
