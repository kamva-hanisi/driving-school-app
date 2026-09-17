import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteCurrentUser,
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";

const router = express.Router();

// Only the first owner can register; the controller closes registration afterward.
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.delete("/me", verifyToken, deleteCurrentUser);

export default router;
