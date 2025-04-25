import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import Product from "../models/product.model.js";

const router = express.Router();

// GET /api/admin/reviews - Get all product reviews for admin
router.get("/admin/reviews", requireAuth, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find({}, "name reviews");
    // Flatten all reviews, attaching product info
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
