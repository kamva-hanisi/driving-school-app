import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendWhatsApp = async (phone, message) => {
  if (!client || !phone || !message) {
    return;
  }

  await client.messages.create({
    from: fromNumber,
    to: `whatsapp:${phone}`,
    body: message,
    mediaUrl: "https://bit.ly/whatsapp-image-example",
  });
};
