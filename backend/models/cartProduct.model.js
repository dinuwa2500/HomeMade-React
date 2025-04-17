import mongoose from 'mongoose';

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity cannot be less than 1'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CartProduct = mongoose.model('cartProduct', cartProductSchema);
export default CartProduct;
