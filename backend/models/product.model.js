import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
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
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    catName: { type: String, default: "", trim: true },
    catId: { type: String, default: "", trim: true },
    subCatId: { type: String, default: "", trim: true },
    subCat: { type: String, default: "", trim: true },
    subCatName: { type: String, default: "", trim: true },
    thirdsubCat: { type: String, default: "", trim: true },
    thirdsubCatName: { type: String, default: "", trim: true },
    thirdsubCatId: { type: String, default: "", trim: true },
    productRam: [{ type: String, default: null }],
    size: [{ type: String, default: null }],
    productWeight: [{ type: String, default: null }],
    location: [
      {
        value: { type: String },
        label: { type: String },
      },
    ],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);

export default Product;
