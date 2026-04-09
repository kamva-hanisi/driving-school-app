import "dotenv/config";
import mysql from "mysql2";

const getEnv = (key) => process.env[key]?.trim();

// Shared MySQL connection used by controllers that need database access.
const db = mysql.createConnection({
  host: getEnv("DB_HOST"),
  user: getEnv("DB_USER"),
  password: getEnv("DB_PASSWORD"),
  database: getEnv("DB_NAME"),
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

export default db;
