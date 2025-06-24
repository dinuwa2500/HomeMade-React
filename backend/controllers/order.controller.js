import Order from "../models/order.model.js";
import mongoose from "mongoose";
import CartProduct from "../models/cartProduct.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, cartItems, delivery_address, subTotalAmt, totalAmt } =
      req.body;
    if (
      !userId ||
      !cartItems ||
      !delivery_address ||
      !subTotalAmt ||
      !totalAmt
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const orderId = "ORD" + Date.now();
    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      orderId,
      items: cartItems.map((item) => ({
        productId: new mongoose.Types.ObjectId(item._id),
        name: item.name,
        image: [item.image],
        size: item.size,
        qty: item.qty,
        price: item.price,
      })),
      paymentId: "",
      payment_status: "pending",
      delivery_address,
      subTotalAmt,
      totalAmt,
      status: "pending_payment",
      paymentSlipUploaded: false,
    });
    await order.save();
    await CartProduct.deleteMany({ userId: userId });
    return res.json({ success: true, message: "Order placed", orderId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (
      ![
        "pending_payment",
        "to_delivery",
        "delivering",
        "delivered",
        "cancelled",
      ].includes(status)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const uploadPaymentSlip = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const paymentSlipUrl = `/uploads/${req.file.filename}`;
    const order = await Order.findOneAndUpdate(
      { orderId, userId: req.user._id },
      {
        paymentSlip: paymentSlipUrl,
        status: "pending_approval",
        paymentSlipUploaded: true,
      },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approvePaymentSlip = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (!order.paymentSlipUploaded) {
      return res
        .status(400)
        .json({ success: false, message: "No slip uploaded" });
    }
    order.status = "to_delivery";
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectPaymentSlip = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (!order.paymentSlipUploaded) {
      return res
        .status(400)
        .json({ success: false, message: "No slip uploaded" });
    }
    order.status = "pending_payment";
    order.paymentSlip = "";
    order.paymentSlipUploaded = false;
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const assignDeliveryToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryUserId } = req.body;
    if (!deliveryUserId) {
      return res.status(400).json({ message: "deliveryUserId is required" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const UserModel = (await import("../models/user.model.js")).default;
    const deliveryUser = await UserModel.findOne({
      _id: deliveryUserId,
      role: "driver",
    });
    if (!deliveryUser) {
      return res
        .status(404)
        .json({ message: "Delivery user not found or not a delivery role" });
    }
    order.delivery = deliveryUserId;
    await order.save();
    res.json({ message: "Delivery user assigned successfully", order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign delivery user",
      error: error.message,
    });
  }
};
