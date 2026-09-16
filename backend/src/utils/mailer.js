import nodemailer from "nodemailer";

const getEnv = (key) => process.env[key]?.trim();

export const contactRecipient =
  getEnv("CONTACT_TO_EMAIL") || "lucashanisi@gmail.com";

const hasSmtpConfig = () =>
  Boolean(getEnv("SMTP_HOST") && getEnv("SMTP_USER") && getEnv("SMTP_PASS"));

const createTransporter = () => {
  if (!hasSmtpConfig()) {
    return null;
  }

  return nodemailer.createTransport({
    host: getEnv("SMTP_HOST"),
    port: Number(getEnv("SMTP_PORT") || 587),
    secure: getEnv("SMTP_SECURE") === "true",
    auth: {
      user: getEnv("SMTP_USER"),
      pass: getEnv("SMTP_PASS"),
    },
  });
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  const transporter = createTransporter();

  if (!transporter) {
    return { sent: false, reason: "missing_smtp_config" };
  }

  const fromAddress = getEnv("MAIL_FROM") || getEnv("SMTP_USER");
  const safePhone = phone || "Not provided";
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(safePhone),
    subject: escapeHtml(subject),
    message: escapeHtml(message),
  };

  await transporter.sendMail({
    from: `"DriveEasy Contact" <${fromAddress}>`,
    to: contactRecipient,
    replyTo: email,
    subject: `DriveEasy contact: ${subject}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${safePhone}`,
      `Subject: ${subject}`,
      "",
      message,
    ].join("\n"),
    html: `
      <h2>New DriveEasy contact message</h2>
      <p><strong>Name:</strong> ${safe.name}</p>
      <p><strong>Email:</strong> ${safe.email}</p>
      <p><strong>Phone:</strong> ${safe.phone}</p>
      <p><strong>Subject:</strong> ${safe.subject}</p>
      <p style="white-space: pre-line;">${safe.message}</p>
    `,
  });

  return { sent: true };
};
