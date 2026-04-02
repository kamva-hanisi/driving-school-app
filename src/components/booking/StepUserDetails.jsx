import Button from "../common/Button";

export default function StepUserDetails({ next, prev, formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="booking-card">
      <h2 className="booking-card__title">Your details</h2>
      <p className="booking-card__text">
        Please provide your contact information:
      </p>
      <div className="form-grid">
        <label className="field">
          <span className="field__label">Full name</span>
          <input
            className="field__input"
            name="name"
            onChange={handleChange}
            placeholder="Your full name"
            value={formData.name || ""}
          />
        </label>
        <label className="field">
          <span className="field__label">Email address</span>
          <input
            className="field__input"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            type="email"
            value={formData.email || ""}
          />
        </label>
        <label className="field">
          <span className="field__label">Phone number</span>
          <input
            className="field__input"
            name="phone"
            onChange={handleChange}
            placeholder="Your phone number"
            value={formData.phone || ""}
          />
        </label>
      </div>

      <div className="button-row">
        <Button onClick={prev} variant="secondary">
          Back
        </Button>
        <Button onClick={next}>
          Confirm booking
        </Button>
      </div>
    </section>
  );
}
