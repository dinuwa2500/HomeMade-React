import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { sendEmailFun } from '../config/emailService.js';
import verificationEmail from '../utilities/VerifyEmailTemplate.js';
import generatedAccessToken from '../utilities/generateAccessToken.js';
import generatedRefreshToken from '../utilities/generateRefreshToken.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
  cloud_name: 'dinuwapvt',
  api_key: '487264227394868',
  api_secret: 'LuuDPSUEt53s0YYBfJMf6HuFiJg', // Click 'View API Keys' above to copy your API secret
  secure: true,
  timeout: 60000, // Increase timeout to 60 seconds
});

console.log('Cloudinary config:', cloudinary.config());

export async function registerUserController(request, response) {
  try {
    let user;
    const { name, email, password } = request.body;
    // Debug: Log the incoming request body
    console.log('Request Body:', request.body);
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
      otp: verifycode,
      otpExpires: Date.now() + 60000,
    });
    await user.save();

    // console.log('Sending email to:', email); // Log the email being passed

    //send verification email
    const verifyEmail = await sendEmailFun({
      to: email,
      subject: 'Verify Email from Craftopia',
      text: '', // Optional plain text version
      html: verificationEmail(name, verifycode), // The HTML template
    });

    //jwt token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET
    );

    return response.status(200).json({
      success: true,
      message: 'User registered successfully, please verify email',
      token: token,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { email, otp } = request.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        error: true,
        success: false,
        message: 'User not found!',
      });
    }

    const isCodeValid = user.otp == otp;
    const isCodeExpired = user.otpExpires > Date.now();

    if (!isCodeValid) {
      return response.status(400).json({
        error: true,
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (!isCodeExpired) {
      return response.status(400).json({
        error: true,
        success: false,
        message: 'OTP has expired',
      });
    }

    if (isCodeValid && isCodeExpired) {
      user.verify_email = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return response.status(200).json({
        error: false,
        success: true,
        message: 'Email verified successfully!',
      });
    }
  } catch (error) {
    console.error('Error in verifyEmailController:', error);
    return response.status(500).json({
      error: true,
      success: false,
      message: 'Internal server error',
    });
  }
}

export async function loginUser(request, response) {
  try {
    const { email, password } = request.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        message: 'User not registered',
        error: true,
        success: false,
      });
    }

    if (!user.verify_email) {
      return response.status(400).json({
        message: 'Please verify your email first',
        error: true,
        success: false,
      });
    }

    if (user.status !== 'Active') {
      return response.status(400).json({
        message: 'Contact admin, your account is not active',
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return response.status(400).json({
        message: 'Incorrect password',
        error: true,
        success: false,
      });
    }

    const accesstoken = await generatedAccessToken(user._id);
    const refreshtoken = await generatedRefreshToken(user._id);

    await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    };

    response.cookie('accesstoken', accesstoken, cookieOptions);
    response.cookie('refreshtoken', refreshtoken, cookieOptions);

    return response.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accesstoken,
        refreshtoken,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return response.status(500).json({
      message: error.message || 'Internal server error',
      error: true,
      success: false,
    });
  }
}

export async function logoutUser(request, response) {
  try {
    const { refreshtoken } = request.cookies;

    if (!refreshtoken) {
      return response.status(400).json({
        success: false,
        error: true,
        message: 'No refresh token provided',
      });
    }

    // Clear cookies
    response.clearCookie('accesstoken');
    response.clearCookie('refreshtoken');

    // Find user by refresh token and clear it from database
    const user = await UserModel.findOneAndUpdate({ refresh_token: '' });
    L;

    if (!user) {
      return response.status(200).json({
        success: true,
        error: false,
        message: 'Logged out successfully',
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error in logoutUser:', error);
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Internal server error',
    });
  }
}

// Avatar controller

const IMGUR_CLIENT_ID = '4a7ef9e565dbe94'; // Replace with your actual Imgur Client ID

export async function userAvatarController(request, response) {
  try {
    const userId = request.user.id;
    const images = request.files;
    const imageArr = [];

    if (!images || images.length === 0) {
      return response.status(400).json({
        success: false,
        error: true,
        message: 'No files uploaded',
      });
    }

    const user = await UserModel.findOne({ _id: userId });

    const userAvatar = user.avatar;

    if (!user) {
      // If user is not found, send a 404 response
      return res.status(404).json({ message: 'User not found' });
    }

    for (const file of images) {
      try {
        const base64Image = fs.readFileSync(file.path, { encoding: 'base64' });

        const uploadRes = await axios.post(
          'https://api.imgur.com/3/image',
          {
            image: base64Image,
            type: 'base64',
          },
          {
            headers: {
              Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
            },
          }
        );

        imageArr.push(uploadRes.data.data.link);

        // Remove local file after upload
        fs.unlinkSync(file.path);
      } catch (uploadError) {
        console.error('Imgur upload error:', uploadError.message);
        continue;
      }
    }

    if (imageArr.length === 0) {
      return response.status(500).json({
        success: false,
        error: true,
        message: 'Failed to upload any files',
      });
    }
    user.avatar = imageArr[0]; // Set the first image URL as the avatar
    await user.save(); // Save the updated user document
    return response.status(200).json({
      success: true,
      error: false,
      message: 'Images uploaded successfully',
      _id: userId,
      avatar: user.avatar, // Send the updated avatar URL
    });
  } catch (error) {
    console.error('Controller error:', error.message);
    return response.status(500).json({
      success: false,
      error: true,
      message: 'Internal server error',
      details: error.message,
    });
  }
}

// deleteHash is returned during upload and must be saved when uploading
export async function deleteImgurImage(deleteHash) {
  try {
    const response = await axios.delete(
      `https://api.imgur.com/3/image/${deleteHash}`,
      {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      }
    );

    return {
      success: true,
      message: 'Image deleted successfully',
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Imgur delete error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to delete image',
      details: error.response?.data || error.message,
    };
  }
}

export async function UserDetailsUpdate(request, response) {
  try {
    const userId = request.user.id;
    const { name, email, password, mobile } = request.body;

    const userExist = await UserModel.findById(userId);

    console.log(userId);

    if (!userExist) {
      return response.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let verifycode = '';

    if (userExist.email) {
      verifycode = Math.floor(100000 + Math.random() * 90000).toString();
    }

    let hashPassword = '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    } else {
      hashPassword = userExist.password;
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name: name,
        mobile: mobile,
        email: email,
        verify_email: email ? false : true,
        password: hashPassword,
        otp: verifycode !== '' ? verifycode : null,
        otpExpires: verifycode !== '' ? Date.now() + 600000 : null,
      },
      {
        new: true,
      }
    );

    //send verification email
    const verifyEmail = await sendEmailFun({
      to: email,
      subject: 'Verify Email from Craftopia',
      text: '', // Optional plain text version
      html: verificationEmail(name, verifycode), // The HTML template
    });
    console.log(verifycode);
    return response.json({
      success: true,
      error: false,
      message: 'User details updated successfully',
      user: updateUser,
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    return response.status(500).json({
      success: false,
      message: 'Failed to update user details',
      error: error.message,
    });
  }
}
