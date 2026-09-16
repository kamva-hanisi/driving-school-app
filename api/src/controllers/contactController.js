import db from "../config/db.js";
import { contactRecipient, sendContactEmail } from "../utils/mailer.js";

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

    const emailResult = await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message,
    });

    if (!emailResult.sent) {
      return res.status(201).json({
        message:
          "Message saved. Email delivery is not configured yet, so no email was sent.",
        emailSent: false,
        recipient: contactRecipient,
      });
    }

    res.status(201).json({
      message: "Message saved and emailed successfully",
      emailSent: true,
      recipient: contactRecipient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send message",
    });
  }
};
