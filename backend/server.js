// server.js (or index.js)

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import cloudinary from "cloudinary";
import connectDB from "./db/db.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import UserModel from "./models/user.model.js";
import cartRouter from "./routes/cart.route.js";
import myList from "./routes/myList.route.js";
import categoryRouter from "./routes/category.route.js";
import orderRouter from "./routes/order.route.js";
import paymentRouter from "./routes/payment.route.js";
import uploadRouter from "./routes/upload.route.js";
import path from "path";
import fs from "fs";
import adminRouter from "./routes/admin.route.js";
import twofaRouter from "./routes/twofa.routes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import connectCloudinary from "./config/cloudinary.js";

// Import all models before using them in routes/controllers
import "./models/user.model.js";
import "./models/payment.model.js";
import "./models/order.model.js";
import "./models/ticketModel.js";

// Config
dotenv.config();

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URI,
  })
);

// Connect Cloudinary
connectCloudinary();

app.use(helmet());
app.use(morgan());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cookieParser());

// DB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

// GET route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/api", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/users/2fa", twofaRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/mylist", myList);
app.use("/api/categories", categoryRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/tickets", ticketRoutes);

// Allow cross-origin requests for uploads (images, slips)
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Serve uploads directory for static access
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Custom inline-serving route for uploads
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }
  // Guess MIME type from extension
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".pdf": "application/pdf",
    ".gif": "image/gif",
    ".webp": "image/webp",
    // add more as needed
  };
  const mimeType = mimeTypes[ext] || "application/octet-stream";
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", "inline");
  fs.createReadStream(filePath).pipe(res);
});

// Example for Express
app.delete("/delete-all-users", async (req, res) => {
  await UserModel.deleteMany({});
  res.json({ message: "All users deleted" });
});

// Configuration
cloudinary.config({
  cloud_name: "dinuwapvt",
  api_key: "487264227394868",
  api_secret: "LuuDPSUEt53s0YYBfJMf6HuFiJg", // Click 'View API Keys' above to copy your API secret
  secure: true,
  timeout: 60000, // Increase timeout to 60 seconds
});

// Test route
app.get("/test-cloudinary", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://picsum.photos/200"
    );
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start server
connectDB();
