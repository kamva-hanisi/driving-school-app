import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteCurrentUser,
  getCurrentUser,
  login,
} from "../controllers/authController.js";

const router = express.Router();

// Public authentication endpoints.
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.delete("/me", verifyToken, deleteCurrentUser);

export default router;
