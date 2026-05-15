import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteCurrentUser,
  getAdmins,
  getCurrentUser,
  handleSocialCallback,
  login,
  register,
  startSocialAuth,
} from "../controllers/authController.js";

const router = express.Router();

// Public authentication endpoints.
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.delete("/me", verifyToken, deleteCurrentUser);
router.get("/admins", verifyToken, getAdmins);
router.get("/google", startSocialAuth("google"));
router.get("/google/callback", handleSocialCallback("google"));
router.get("/facebook", startSocialAuth("facebook"));
router.get("/facebook/callback", handleSocialCallback("facebook"));

export default router;
