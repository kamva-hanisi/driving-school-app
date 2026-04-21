import { useState } from "react";
import Button from "../components/common/Button";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/contact", form);

      alert("Your message has been sent successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      alert("Failed to send message");
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-page__header">
        <h1>Contact Us</h1>
        <p>
          Need help with your booking, payment, or driving lessons? Send us a
          message and we’ll get back to you.
        </p>
      </div>

      <div className="contact-page__grid">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>

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

          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </section>
  );
}
