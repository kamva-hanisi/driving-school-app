import { useEffect, useMemo, useState } from "react";
import Button from "../components/common/Button";
import API from "../services/api";

const CONTACT_DRAFT_KEY = "driveeasy_contact_draft";
const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};
const contactPhone = "+27695864843";
const contactEmail = "lucashanisi@gmail.com";
const whatsappText = encodeURIComponent(
  "Hi DriveEasy, I need help with driving lessons or a booking.",
);

const validators = {
  name: (value) =>
    value.trim().length >= 2 ? "" : "Enter your full name.",
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? ""
      : "Enter a valid email address.",
  subject: (value) =>
    value.trim().length >= 3 ? "" : "Enter a short subject.",
  message: (value) =>
    value.trim().length >= 12 ? "" : "Write at least 12 characters.",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const savedDraft = JSON.parse(
        localStorage.getItem(CONTACT_DRAFT_KEY) || "null",
      );

      if (savedDraft && typeof savedDraft === "object") {
        setForm({ ...initialForm, ...savedDraft });
      }
    } catch {
      localStorage.removeItem(CONTACT_DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    const hasDraft = Object.values(form).some((value) => value.trim());

    if (hasDraft) {
      localStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify(form));
    } else {
      localStorage.removeItem(CONTACT_DRAFT_KEY);
    }
  }, [form]);

  const errors = useMemo(
    () =>
      Object.entries(validators).reduce((currentErrors, [key, validate]) => {
        const error = validate(form[key]);
        return error ? { ...currentErrors, [key]: error } : currentErrors;
      }, {}),
    [form],
  );
  const hasErrors = Object.keys(errors).length > 0;
  const messageCharacters = form.message.trim().length;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
    setStatus({ type: "", message: "" });
  };

  const handleBlur = (e) => {
    setTouched((current) => ({
      ...current,
      [e.target.name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (hasErrors) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before sending.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: "", message: "" });

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      };
      const response = await API.post("/contact", payload);

      setStatus({
        type: "success",
        message:
          response.data.message || "Your message has been sent successfully.",
      });

      setForm(initialForm);
      setTouched({});
      localStorage.removeItem(CONTACT_DRAFT_KEY);
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
            <a href={`tel:${contactPhone}`}>+27 69 586 4843</a>
          </div>

          <div className="contact-info__card">
            <h3>Email</h3>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
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
            className="whatsapp-btn"
            href={`https://wa.me/${contactPhone.replace("+", "")}?text=${whatsappText}`}
            rel="noreferrer"
            target="_blank"
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
            aria-invalid={Boolean(touched.name && errors.name)}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name ? (
            <span className="field-error">{errors.name}</span>
          ) : null}

          <input
            aria-invalid={Boolean(touched.email && errors.email)}
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email ? (
            <span className="field-error">{errors.email}</span>
          ) : null}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            aria-invalid={Boolean(touched.subject && errors.subject)}
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.subject && errors.subject ? (
            <span className="field-error">{errors.subject}</span>
          ) : null}

          <textarea
            aria-invalid={Boolean(touched.message && errors.message)}
            name="message"
            rows="6"
            placeholder="Write your message..."
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="contact-form__meta">
            {touched.message && errors.message ? (
              <span className="field-error">{errors.message}</span>
            ) : (
              <span>Draft saves automatically.</span>
            )}
            <span>{messageCharacters} characters</span>
          </div>

          <Button disabled={isSubmitting || hasErrors} type="submit">
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
