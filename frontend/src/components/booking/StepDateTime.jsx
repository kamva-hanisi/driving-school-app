import Button from "../common/Button";
import TimeSlots from "./TimeSlots";

export default function StepDateTime({ next, prev, formData, setFormData }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
      ...(name === "bookingDate" ? { bookingTime: "" } : {}),
    });
  };

  const handleTimeSelect = (bookingTime) => {
    setFormData({ ...formData, bookingTime });
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
          <span className="field__label">Available time slots</span>
          {formData.bookingDate ? (
            <TimeSlots
              date={formData.bookingDate}
              selectedTime={formData.bookingTime}
              setTime={handleTimeSelect}
            />
          ) : (
            <span className="booking-card__text">
              Choose a date first to see the available time slots.
            </span>
          )}
          {formData.bookingTime && (
            <span className="field__hint">
              Selected time: {formData.bookingTime}
            </span>
          )}
        </label>
      </div>

      <div className="button-row">
        <Button onClick={prev} variant="secondary">
          Back
        </Button>
        <Button onClick={next} variant="dark">
          Continue
        </Button>
      </div>
    </section>
  );
}
