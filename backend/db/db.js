import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Config
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected : ${mongoose.connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
