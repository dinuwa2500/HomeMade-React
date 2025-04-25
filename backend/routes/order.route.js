import express from "express";
import {
  placeOrder,
  updateOrderStatus,
  getAllOrders,
  getMyOrders,
  uploadPaymentSlip,
  approvePaymentSlip,
  rejectPaymentSlip,
  assignDeliveryToOrder,
} from "../controllers/order.controller.js";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import multer from "multer";
import path from "path";
import Order from "../models/order.model.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

// Place a new order
router.post("/place", requireAuth, placeOrder);

// User: get their own orders
router.get("/myorders", requireAuth, getMyOrders);

// Driver: get all assigned orders
// IMPORTANT: This route must be defined BEFORE any conflicting routes
router.get("/assigned", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ delivery: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("[ERROR] /api/order/assigned:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Admin: get all orders
router.get("/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "firstName lastName name email").sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: update order status
router.patch("/:orderId/status", requireAuth, requireAdmin, updateOrderStatus);

// User: upload payment slip for an order
router.post(
  "/:orderId/slip",
  requireAuth,
  upload.single("slip"),
  uploadPaymentSlip
);

// Admin: approve payment slip
router.patch(
  "/:orderId/slip/approve",
  requireAuth,
  requireAdmin,
  approvePaymentSlip
);
// Admin: reject payment slip
router.patch(
  "/:orderId/slip/reject",
  requireAuth,
  requireAdmin,
  rejectPaymentSlip
);

// Get single order by _id or orderId (admin only)
router.get("/:orderId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    let order = await Order.findOne({ _id: orderId }).populate(
      "userId",
      "firstName lastName name email"
    );
    if (!order) {
      order = await Order.findOne({ orderId }).populate(
        "userId",
        "firstName lastName name email"
      );
    }
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
});

// Driver: get order details for assigned delivery
router.get("/assigned/:orderId", requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate("delivery", "name email mobile");
    if (!order) return res.status(404).json({ message: "Order not found" });
    // Only allow if the logged-in user is the assigned driver
    if (!order.delivery || order.delivery._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have access to this order" });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
});

// Assign delivery to order
router.patch(
  "/order/:orderId/assign-delivery",
  requireAuth,
  requireAdmin,
  assignDeliveryToOrder
);

export default router;
