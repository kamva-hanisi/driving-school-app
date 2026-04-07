import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Starts the HTTP server after environment variables are loaded.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
