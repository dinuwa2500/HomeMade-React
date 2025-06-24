import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import Product from "../models/product.model.js";

const router = express.Router();

router.get("/admin/reviews", requireAuth, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find({}, "name reviews");
    const reviews = products.flatMap(product =>
      (product.reviews || []).map(review => ({
        ...review._doc,
        productName: product.name,
        productId: product._id,
      }))
    );
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
});

export default router;
