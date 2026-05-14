import "dotenv/config";
import pg from "pg";

const getEnv = (key) => process.env[key]?.trim();

const { Pool } = pg;

// Shared PostgreSQL pool used across the app. Works with local pgAdmin-created
// databases and hosted PostgreSQL URLs.
const db = new Pool(
  getEnv("DATABASE_URL")
    ? {
        connectionString: getEnv("DATABASE_URL"),
      }
    : {
        host: getEnv("DB_HOST") || "127.0.0.1",
        port: Number(getEnv("DB_PORT") || 5432),
        user: getEnv("DB_USER"),
        password: getEnv("DB_PASSWORD"),
        database: getEnv("DB_NAME"),
        max: 10,
        connectionTimeoutMillis: 10000,
      },
);

export const pingDatabase = async () => {
  await db.query("SELECT 1");
};

export default db;
