import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import fs from "fs";
import { sendEmailFun } from "../config/emailService.js";
import verificationEmail from "../utilities/VerifyEmailTemplate.js";
import generatedAccessToken from "../utilities/generateAccessToken.js";
import generatedRefreshToken from "../utilities/generateRefreshToken.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dinuwapvt",
  api_key: "487264227394868",
  api_secret: "LuuDPSUEt53s0YYBfJMf6HuFiJg",
  secure: true,
  timeout: 60000,
});

export async function registerUserController(request, response) {
  try {
    let user;
    const { name, email, password, role } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "provide email name password",
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        message: "User already exists with this email",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "admin") {
      user = new UserModel({
        name,
        email,
        password: hashPassword,
        role: "admin",
        verify_email: true,
      });
    } else {
      const verifycode = Math.floor(100000 + Math.random() * 90000).toString();
      user = new UserModel({
        name,
        email,
        password: hashPassword,
        otp: verifycode,
        role: "user",
        otpExpires: Date.now() + 60000,
      });
    }
    await user.save();

    if (role !== "admin") {
      const verifyEmail = await sendEmailFun({
        to: email,
        subject: "Verify Email from Craftopia",
        text: "",
        html: verificationEmail(name, user.otp),
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET
    );

    return response.status(200).json({
      success: true,
      message: "User registered successfully, please verify email",
      token: token,
      user: user,
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
        message: "User not found!",
      });
    }

    const isCodeValid = user.otp == otp;
    const isCodeExpired = user.otpExpires > Date.now();

    if (!isCodeValid) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!isCodeExpired) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "OTP has expired",
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
        message: "Email verified successfully!",
      });
    }
  } catch (error) {
    return response.status(500).json({
      error: true,
      success: false,
      message: "Internal server error",
    });
  }
}

export async function loginUser(request, response) {
  try {
    const { email, password } = request.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    if (!user.verify_email) {
      return response.status(400).json({
        message: "Please verify your email first",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact admin, your account is not active",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return response.status(400).json({
        message: "Incorrect password",
        error: true,
        success: false,
      });
    }

    if (user.twoFaEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.twoFaEmailCode = code;
      user.twoFaCodeExpires = Date.now() + 5 * 60 * 1000;
      await user.save();
      await sendEmailFun({
        to: user.email,
        subject: "2Fa Email from Craftopia",
        text: "",
        html: verificationEmail(user.name, code),
      });
      return response.status(200).json({
        success: false,
        twofa: true,
        message: "2FA required. Code sent to your email.",
        userId: user._id,
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
      sameSite: "None",
    };

    response.cookie("accesstoken", accesstoken, cookieOptions);
    response.cookie("refreshtoken", refreshtoken, cookieOptions);

    return response.status(200).json({
      success: true,
      user: user,
      message: "Login successful",
      data: {
        accesstoken,
        refreshtoken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
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
        message: "No refresh token provided",
      });
    }

    response.clearCookie("accesstoken");
    response.clearCookie("refreshtoken");

    const user = await UserModel.findOneAndUpdate({ refresh_token: "" });
    if (!user) {
      return response.status(200).json({
        success: true,
        error: false,
        message: "Logged out successfully",
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "Logged out successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal server error",
    });
  }
}

const IMGUR_CLIENT_ID = "4a7ef9e565dbe94";

export async function userAvatarController(request, response) {
  try {
    const userId = request.user.id;
    const file = request.file;

    if (!file) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "No file uploaded",
      });
    }

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return response.status(404).json({ message: "User not found" });
    }

    try {
      const base64Image = fs.readFileSync(file.path, { encoding: "base64" });

      const uploadRes = await axios.post(
        "https://api.imgur.com/3/image",
        {
          image: base64Image,
          type: "base64",
        },
        {
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
        }
      );

      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      const imageUrl = uploadRes.data.data.link;

      user.avatar = imageUrl;
      await user.save();

      return response.status(200).json({
        success: true,
        error: false,
        message: "Image uploaded successfully",
        _id: userId,
        avatar: user.avatar,
      });
    } catch (uploadError) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
      details: error.message || "Unknown error occurred",
    });
  }
}

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
      message: "Image deleted successfully",
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete image",
      details: error.response?.data || error.message,
    };
  }
}

export async function UserDetailsUpdate(request, response) {
  try {
    const userId = request.user._id || request.user.id;
    const {
      name,
      password,
      mobile,
      address,
      city,
      country,
      dob,
      gender,
      role,
    } = request.body;

    const userExist = await UserModel.findById(userId);
    if (!userExist) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let updateFields = {
      name: name || userExist.name,
      mobile: mobile || userExist.mobile,
      email: userExist.email,
      verify_email: userExist.verify_email,
      otp: userExist.otp,
      otpExpires: userExist.otpExpires,
      address: address || userExist.address,
      city: city || userExist.city,
      country: country || userExist.country,
      dob: dob || userExist.dob,
      gender: gender || userExist.gender,
      role: role || userExist.role,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    } else {
      updateFields.password = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    return response.json({
      success: true,
      error: false,
      message: "User details updated successfully",
      user: updateUser,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to update user details",
      error: error.message,
    });
  }
}

export async function forgotPassword(request, response) {
  try {
    const { email, role } = request.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found with this email address",
      });
    }

    let verifycode = Math.floor(100000 + Math.random() * 90000).toString();

    user.otp = verifycode;
    user.otpExpires = Date.now() + 600000;

    await user.save();

    const verifyEmail = await sendEmailFun({
      to: email,
      subject: "Password reset OTP",
      text: "",
      html: verificationEmail(user.name, verifycode),
    });

    return response.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
      otp: verifycode,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
      error: error.message,
    });
  }
}

export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body;
    const user = await UserModel.findOne({ email: email });

    if (!email || !otp) {
      return response.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found with this email address",
      });
    }

    if (otp !== user.otp) {
      return response.status(400).json({
        success: false,
        message: "Invalid OTP code",
      });
    }

    if (user.otpExpires < Date.now()) {
      return response.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return response.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function resetpass(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body;

    if ((!email || !newPassword, !confirmPassword)) {
      return response.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    user.forgot_password_otp = null;
    user.forgot_password_expiry = null;
    await user.save();

    return response.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function refreshToken(request, response) {
  try {
    const { refreshToken } = request.cookies.refreshtoken;

    if (!refreshToken) {
      return response.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return response.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: "Invalid refresh token",
      error: error.message,
    });
  }
}

export async function getLoginUserDetails(request, response) {
  try {
    const userId = request.user.id;

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return response.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
}

export async function deleteUser(request, response) {
  try {
    const userId = request.user._id || request.user.id;
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return response.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
}

export async function getUsers(request, response) {
  try {
    const { role } = request.query;
    let query = {};
    if (role) query.role = role;
    const users = await UserModel.find(query);
    response.json({ success: true, users });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
}

export async function send2faCode(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    const user = await UserModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFaEmailCode = code;
    user.twoFaCodeExpires = Date.now() + 600000;
    await user.save();
    await sendEmailFun({
      to: user.email,
      subject: "2Fa Email from Craftopia",
      text: "",
      html: verificationEmail(user.name, code),
    });
    res.json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send 2FA code",
      error: err.message,
    });
  }
}

export async function verify2faCode(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    const { code, enableTwoFa } = req.body;
    const user = await UserModel.findById(userId);
    if (
      !user ||
      user.twoFaEmailCode !== code ||
      !user.twoFaCodeExpires ||
      user.twoFaCodeExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });
    }
    user.twoFaEmailCode = null;
    user.twoFaCodeExpires = null;
    if (enableTwoFa) {
      user.twoFaEnabled = true;
    }
    const accesstoken = await generatedAccessToken(user._id);
    const refreshtoken = await generatedRefreshToken(user._id);
    await user.save();
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accesstoken", accesstoken, cookieOptions);
    res.cookie("refreshtoken", refreshtoken, cookieOptions);
    res.json({
      success: true,
      message: "2FA verified. Login successful.",
      data: {
        accesstoken,
        refreshtoken,
      },
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to verify 2FA code",
      error: err.message,
    });
  }
}

export async function disable2fa(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    const user = await UserModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    user.twoFaEnabled = false;
    user.twoFaEmailCode = null;
    await user.save();
    res.json({ success: true, message: "Two-factor authentication disabled." });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to disable 2FA",
      error: err.message,
    });
  }
}
