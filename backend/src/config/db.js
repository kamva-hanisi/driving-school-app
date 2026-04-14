import "dotenv/config";
import mysql from "mysql2";

const getEnv = (key) => process.env[key]?.trim();

// Shared MySQL pool used across the app. Requests can borrow connections on demand
// without forcing an eager socket connection during module import.
const db = mysql.createPool({
  host: getEnv("DB_HOST"),
  user: getEnv("DB_USER"),
  password: getEnv("DB_PASSWORD"),
  database: getEnv("DB_NAME"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

export const pingDatabase = () =>
  new Promise((resolve, reject) => {
    db.query("SELECT 1", (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

export default db;
