
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import { generateJWT } from "../utils/jwt.js"; // Adjust path based on your structure
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

// Register
const registerUser = asyncHandler(async (req, res) => {
  console.log("RegisterUser called", req.body);
  const { name, email, password, role, customerId } = req.body;
  if (!name || !email || !password || !customerId) {
    throw new ApiError(400, "Missing required fields");
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    customerId,
  });

  await sendEmail({
    to: user.email,
    subject: "Welcome to Support!",
    html: `<p>Thank you for registering, ${user.name}!</p>`
  });

  const token = generateJWT({ id: user._id, role: user.role, customerId: user.customerId });
  res.status(201).json(new ApiResponse(201, { token, user }, "User registered"));
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log('User found:', user);
  if (!user || !user.isActive) throw new ApiError(401, "Invalid email or user inactive");
  console.log("Entered Password:", password);
  console.log("Stored Password:", user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = generateJWT({ id: user._id, role: user.role, customerId: user.customerId });
  res.status(200).json(new ApiResponse(200, { token, user }, "Login successful"));
});

// Get all users (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ customerId: req.user.customerId });
  res.status(200).json(new ApiResponse(200, users, "Fetched users successfully"));
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  await user.save();
  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

// Deactivate user
const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  user.isActive = false;
  await user.save();

  res.status(200).json(new ApiResponse(200, user, "User deactivated"));
});

// Change user role
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  user.role = role;
  await user.save();

  res.status(200).json(new ApiResponse(200, user, "User role updated"));
});

// Get users by role
const getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const users = await User.find({ role, customerId: req.user.customerId });

  res.status(200).json(new ApiResponse(200, users, `Users with role ${role} fetched`));
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html: `<p>Reset your password: <a href='${resetUrl}'>Reset Link</a></p>`
  });

  res.json(new ApiResponse(200, null, "Password reset email sent"));
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, "Invalid or expired token");

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json(new ApiResponse(200, null, "Password has been reset"));
});

// Send Verification Email (on registration)
export const sendVerificationEmail = async (user) => {
  console.log("sendVerificationEmail called", user.email);
  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = token;
  await user.save();
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `<p>Verify your email: <a href='${verifyUrl}'>Verify Link</a></p>`
  });
};

// Verify Email
export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) throw new ApiError(400, "Invalid or expired token");
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  res.json(new ApiResponse(200, null, "Email verified successfully"));
});

export {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  changeUserRole,
  getUsersByRole,
};
