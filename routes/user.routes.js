import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  changeUserRole,
  getUsersByRole,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorize.middleware.js";
import { registerValidation, loginValidation, updateUserValidation, changeUserRoleValidation } from "../validators/userValidators.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

// Public routes
router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/login", loginValidation, validateRequest, loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);

// Protected routes - require auth
router.use(authMiddleware);

// Admin only routes
router.get("/", authorizeRoles("admin"), getAllUsers);
router.get("/role/:role", authorizeRoles("admin"), getUsersByRole);
router.put("/:id", authorizeRoles("admin"), updateUserValidation, validateRequest, updateUser);
router.put("/:id/deactivate", authorizeRoles("admin"), deactivateUser);
router.put("/:id/role", authorizeRoles("admin"), changeUserRoleValidation, validateRequest, changeUserRole);

// Both admin and self can access
router.get("/:id", getUserById);

export default router;
