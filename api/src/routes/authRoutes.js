import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createTeamMember,
  deleteCurrentUser,
  deleteTeamMember,
  getCurrentUser,
  getTeam,
  login,
  register,
} from "../controllers/authController.js";

const router = express.Router();

// Each registration creates an isolated company owner workspace.
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.delete("/me", verifyToken, deleteCurrentUser);
router.get("/team", verifyToken, getTeam);
router.post("/team", verifyToken, createTeamMember);
router.delete("/team/:id", verifyToken, deleteTeamMember);

export default router;
