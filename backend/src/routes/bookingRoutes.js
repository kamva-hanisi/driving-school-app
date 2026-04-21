import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createBooking,
  deleteBooking,
  getPublicBookingStatus,
  getBookingSummary,
  getBookings,
  getUnavailableSlots,
  updatePublicBookingDetails,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/unavailable", getUnavailableSlots);
router.get("/public/:reference", getPublicBookingStatus);
router.patch("/public/:reference", updatePublicBookingDetails);
router.get("/summary", verifyToken, getBookingSummary);
router.get("/", verifyToken, getBookings);
router.patch("/:id/status", verifyToken, updateBookingStatus);
router.delete("/:id", verifyToken, deleteBooking);

export default router;
