import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getBookings,
  getUnavailableSlots,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", verifyToken, getBookings);
router.get("/unavailable", getUnavailableSlots);

export default router;
