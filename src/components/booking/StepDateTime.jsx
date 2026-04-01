export default function StepDateTime({ next, prev, formData, setFormData }) {
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <section className="booking-card">
      <h2 className="booking-card__title">Pick date and time</h2>
      <p className="booking-card__text">
        Choose a date and time for your booking:
      </p>
      <div className="form-grid">
        <label className="field">
          <span className="field__label">Preferred date</span>
          <input
            className="field__input"
            name="bookingDate"
            onChange={handleChange}
            type="date"
            value={formData.bookingDate || ""}
          />
        </label>
        <label className="field">
          <span className="field__label">Preferred time</span>
          <input
            className="field__input"
            name="bookingTime"
            onChange={handleChange}
            type="time"
            value={formData.bookingTime || ""}
          />
        </label>
      </div>

      <div className="button-row">
        <button className="button button--secondary" onClick={prev} type="button">
          Back
        </button>
        <button className="button button--dark" onClick={next} type="button">
          Continue
        </button>
      </div>
    </section>
  );
}
