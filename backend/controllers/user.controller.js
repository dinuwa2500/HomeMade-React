import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerUserController(request, response) {
  try {
    let user;
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: 'provide email name password',
        error: true,
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        message: 'User already exists with this email',
        error: true,
        success: false,
      });
    }

    const verifycode = Math.floor(100000 + Math.random() * 90000).toString();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = new UserModel({
      name,
      email,
      password: hashPassword,
    });
    await user.save();

    //send verification email
    const resp = sendEmailFun(
      email,
      'verify email ',
      '',
      'Your OTP is ' + verifycode
    );
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
