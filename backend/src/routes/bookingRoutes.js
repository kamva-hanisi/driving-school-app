import express from "express";
import {
  createBooking,
  getBookings,
  getUnavailableSlots,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/unavailable", getUnavailableSlots);

export default router;
