import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getBookingSummary,
  getBookings,
  getUnavailableSlots,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/unavailable", getUnavailableSlots);
router.get("/summary", verifyToken, getBookingSummary);
router.get("/", verifyToken, getBookings);
router.patch("/:id/status", verifyToken, updateBookingStatus);

export default router;
