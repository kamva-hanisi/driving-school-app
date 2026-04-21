import db from "../config/db.js";
import nodemailer from "nodemailer";

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

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
      VALUES (?, ?, ?, ?, ?)
    `,
      [name, email, phone, subject, message],
    );

    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.trim();

    if (!emailUser || !emailPass) {
      return res.status(201).json({
        message:
          "Your message was saved successfully, but email forwarding is not configured yet.",
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      await transporter.sendMail({
        from: emailUser,
        replyTo: email,
        to: emailUser,
        subject: `Contact: ${subject}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });
    } catch (emailError) {
      console.error("Contact email forwarding failed:", emailError);
      return res.status(201).json({
        message:
          "Your message was saved successfully, but email forwarding failed on the server.",
      });
    }

    res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send message",
    });
  }
};
