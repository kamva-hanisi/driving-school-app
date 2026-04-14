import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// Global middleware for cross-origin requests and JSON request parsing.
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Feature routes are mounted under the API namespace.
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentRoutes);

export default app;
