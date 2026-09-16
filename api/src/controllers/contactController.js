import db from "../config/db.js";

const query = (sql, values = []) =>
  db.query(sql, values).then((result) => result.rows);

export const sendContactMessage = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const phone = req.body.phone?.trim() || null;
    const subject = req.body.subject?.trim();
    const message = req.body.message?.trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Name, email, subject, and message are required.",
      });
    }

    await query(
      `
      INSERT INTO contact_messages
      (name, email, phone, subject, message)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [name, email, phone, subject, message],
    );

    res.status(201).json({
      message: "Message saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send message",
    });
  }
};
