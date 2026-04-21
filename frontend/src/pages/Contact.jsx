import { useState } from "react";
import Button from "../components/common/Button";
import API from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setStatus({ type: "", message: "" });

      const response = await API.post("/contact", form);

      setStatus({
        type: "success",
        message:
          response.data.message || "Your message has been sent successfully.",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-page__header">
        <h1>Contact Us</h1>
        <p>
          Need help with your booking or driving lessons? Send us a message and
          we will get back to you.
        </p>
      </div>

      <div className="contact-page__grid">
        <div className="contact-info">
          <h2>Get in touch</h2>

          <div className="contact-info__card">
            <h3>Phone</h3>
            <p>+27 69 586 4843</p>
          </div>

          <div className="contact-info__card">
            <h3>Email</h3>
            <p>lucashanisi@gmail.com</p>
          </div>

          <div className="contact-info__card">
            <h3>Location</h3>
            <p>Johannesburg, South Africa</p>
          </div>

          <div className="contact-info__card">
            <h3>Office Hours</h3>
            <p>Mon - Fri: 08:00 AM - 17:00 PM</p>
          </div>

          <a
            href="https://wa.me/27712345678"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            Chat on WhatsApp
          </a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>

          {status.message ? (
            <p
              className={`form-status ${
                status.type === "error"
                  ? "form-status--error"
                  : "form-status--success"
              }`}
            >
              {status.message}
            </p>
          ) : null}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
          />

          <textarea
            name="message"
            rows="6"
            placeholder="Write your message..."
            value={form.message}
            onChange={handleChange}
          />

          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
