import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

const normalizeOrigin = (value) => {
  if (!value) {
    return "";
  }

  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
};

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const corsOptions =
  allowedOrigins.length > 0
    ? {
        origin(origin, callback) {
          if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
            callback(null, true);
            return;
          }

          callback(null, false);
        },
      }
    : undefined;

// Global middleware for cross-origin requests and JSON request parsing.
app.use(cors(corsOptions));
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Feature routes are mounted under the API namespace.
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);

export default app;
