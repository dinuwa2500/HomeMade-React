// server.js (or index.js)

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from 'cloudinary';
import connectDB from './db/db.js';

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
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

// Start server
connectDB();
// GET route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
