import { Router } from "express";
import {
  forgotPassword,
  getLoginUserDetails,
  loginUser,
  logoutUser,
  registerUserController,
  resetpass,
  userAvatarController,
  UserDetailsUpdate,
  verifyEmailController,
  verifyForgotPasswordOtp,
  deleteUser,
  getUsers,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import UserModel from "../models/user.model.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verifyemail", verifyEmailController);
userRouter.post("/login", loginUser);
userRouter.get("/logout", auth, logoutUser);
userRouter.put("/avatar", auth, upload.single("avatar"), userAvatarController);
userRouter.put("/:id", auth, upload.none(), UserDetailsUpdate);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-password", verifyForgotPasswordOtp);
userRouter.post("/reset-password", resetpass);
userRouter.get("/details", auth, getLoginUserDetails);
userRouter.get("/allusers", auth, getLoginUserDetails);
userRouter.delete("/me", auth, deleteUser);

// List all delivery users
userRouter.get("/deliveries", requireAuth, requireAdmin, async (req, res) => {
  try {
    const UserModel = (await import("../models/user.model.js")).default;
    const deliveries = await UserModel.find(
      { role: "delivery" },
      "-password -refresh_token -access_token"
    );
    res.json({ deliveries });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch delivery users",
      error: error.message,
    });
  }
});

// List all users (admin only)

userRouter.get("/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await UserModel.find(
      {},
      "-password -refresh_token -access_token"
    );
    res.json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
});

// Update user role (admin only)
userRouter.patch("/:id/role", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: "Role is required" });
    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User role updated", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user role", error: error.message });
  }
});

// Admin: Delete any user by ID
userRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
  }
});

userRouter.get("/", getUsers);

export default userRouter;
