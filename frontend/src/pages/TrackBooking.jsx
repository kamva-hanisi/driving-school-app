import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrackBooking() {
  const [reference, setReference] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedReference = reference.trim().toUpperCase();

    if (!trimmedReference) {
      return;
    }

    navigate(`/booking/status/${trimmedReference}`);
  };

  return (
    <main className="booking-page booking-status-page">
      <section className="booking-card booking-status-card">
        <p className="booking-status-card__eyebrow">Booking lookup</p>
        <h1 className="booking-card__title">Track your booking</h1>
        <p className="booking-card__text">
          Paste the booking reference from your downloaded booking card to check
          whether your lesson is still pending or has been confirmed.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Booking reference</span>
            <input
              className="field__input"
              onChange={(event) => setReference(event.target.value)}
              placeholder="Example: DRV-1A2B3C4D"
              value={reference}
            />
          </label>
          <button className="btn btn--dark" type="submit">
            Track booking
          </button>
        </form>
      </section>
    </main>
  );
}
