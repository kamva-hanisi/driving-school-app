import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ALLOWED_ROLES = new Set(["owner", "admin", "super_admin"]);

const query = async (sql, values = []) => {
  const result = await db.query(sql, values);
  return result.rows;
};

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school_id: user.school_id,
    },
    process.env.JWT_SECRET,
  );

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  school_id: user.school_id,
  account_status: user.account_status,
  deactivated_until: user.deactivated_until,
});

const findUserByEmail = async (email) => {
  const users = await query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
  return users[0] || null;
};

const assignOwnSchoolIfMissing = async (user) => {
  if (user.role === "super_admin" || user.school_id) {
    return user;
  }

  await query("UPDATE users SET school_id = id WHERE id = $1", [user.id]);
  const users = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [user.id]);
  return users[0] || user;
};

export const register = async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const role = req.body.role?.trim().toLowerCase() || "admin";

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  if (!ALLOWED_ROLES.has(role)) {
    return res.status(400).json({ message: "Invalid account role" });
  }

  try {
    const hashed = bcrypt.hashSync(password, 10);

    const users = await query(
      `INSERT INTO users (name, email, password, role, school_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, hashed, role, null],
    );

    await assignOwnSchoolIfMissing(users[0]);

    return res.json({ message: "User registered" });
  } catch (error) {
    if (error?.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }

    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.account_status === "deactivated" &&
      user.deactivated_until &&
      new Date(user.deactivated_until) > new Date()
    ) {
      return res.status(403).json({
        message:
          "This account is temporarily deactivated. Please try again after 30 days or contact support.",
      });
    }

    if (user.account_status === "deleted") {
      return res.status(403).json({ message: "This account has been deleted" });
    }

    const valid = bcrypt.compareSync(password, user.password || "");

    if (!valid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const activeUser = await assignOwnSchoolIfMissing(user);
    const token = createToken(activeUser);

    return res.json({
      token,
      user: formatUser(activeUser),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log in" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const users = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [
      req.user.id,
    ]);

    if (!users[0]) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.json({ user: formatUser(users[0]) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load account settings" });
  }
};

export const deleteCurrentUser = async (req, res) => {
  const mode = req.body.mode?.trim().toLowerCase();

  if (!["temporary", "permanent"].includes(mode)) {
    return res.status(400).json({
      message: "Choose temporary deactivation or permanent deletion",
    });
  }

  try {
    if (mode === "permanent") {
      const result = await db.query("DELETE FROM users WHERE id = $1", [req.user.id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Account not found" });
      }

      return res.json({ message: "Account permanently deleted" });
    }

    const result = await query(
      `UPDATE users
       SET account_status = 'deactivated',
           deletion_scheduled_at = CURRENT_TIMESTAMP,
           deactivated_until = CURRENT_TIMESTAMP + INTERVAL '30 days'
       WHERE id = $1`,
      [req.user.id],
    );

    if (result.length === 0) {
      const check = await query("SELECT id FROM users WHERE id = $1", [req.user.id]);
      if (check.length === 0) {
        return res.status(404).json({ message: "Account not found" });
      }
    }

    const users = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [
      req.user.id,
    ]);

    if (!users[0]) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.json({
      message: "Account temporarily deactivated for 30 days",
      user: formatUser(users[0]),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update account" });
  }
};

export const getAdmins = async (req, res) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({ message: "Platform admin access required" });
  }

  try {
    const admins = await query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.role,
         u.school_id,
         COALESCE(u.account_status, 'active') AS account_status,
         COUNT(b.id)::int AS total_bookings,
         COUNT(b.id) FILTER (WHERE b.status = 'pending')::int AS pending_bookings,
         COUNT(b.id) FILTER (WHERE b.status = 'confirmed')::int AS confirmed_bookings
       FROM users u
       LEFT JOIN bookings b ON b.school_id = u.school_id
       WHERE u.role IN ('owner', 'admin')
       GROUP BY u.id, u.name, u.email, u.role, u.school_id, u.account_status
       ORDER BY u.created_at DESC`,
    );

    return res.json(admins);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load admin accounts" });
  }
};
