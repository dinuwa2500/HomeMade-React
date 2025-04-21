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
import userRouter from './routes/user.route.js';
import UserModel from './models/user.model.js';

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

// GET route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/api/users', userRouter);

// Example for Express
app.delete('/delete-all-users', async (req, res) => {
  await UserModel.deleteMany({});
  res.json({ message: 'All users deleted' });
});

// Configuration
cloudinary.config({
  cloud_name: 'dinuwapvt',
  api_key: '487264227394868',
  api_secret: 'LuuDPSUEt53s0YYBfJMf6HuFiJg', // Click 'View API Keys' above to copy your API secret
  secure: true,
  timeout: 60000, // Increase timeout to 60 seconds
});

// Test route
app.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      'https://picsum.photos/200'
    );
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start server
connectDB();
