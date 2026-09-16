import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteCurrentUser,
  getAdmins,
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";

const router = express.Router();

// Public authentication endpoints.
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.delete("/me", verifyToken, deleteCurrentUser);
router.get("/admins", verifyToken, getAdmins);

export default router;
