import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  brand: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  catName: {
    type: String,
    default: '',
  },
  catId: {
    type: String,
    default: '',
  },
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
