import "dotenv/config";
import app from "./app.js";
import { pingDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pingDatabase();
    console.log("Connected to the PostgreSQL database.");
  } catch (error) {
    console.error("Database connection check failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
