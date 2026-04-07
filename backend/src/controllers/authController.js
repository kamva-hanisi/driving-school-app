import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Creates a new user record after hashing the incoming password.
export const register = (req, res) => {
  const { name, email, password } = req.body;

  const hashed = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered" });
    },
  );
};

// Validates user credentials and returns a signed JWT for later protected requests.
export const login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) return res.status(404).json("User not found");

    const user = results[0];

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ token });
  });
};
