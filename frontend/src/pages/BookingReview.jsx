import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import API from "../services/api";
import { downloadBookingCard } from "../utils/downloadBookingCard";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));

const formatTime = (value) => String(value).slice(0, 5);

export default function BookingReview() {
  const { reference } = useParams();
  const { state } = useLocation();
  const [booking, setBooking] = useState(state?.booking || null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!state?.booking);
  const cardRef = useRef(null);

  useEffect(() => {
    if (booking) {
      return;
    }

    let ignore = false;

    const loadBooking = async () => {
      try {
        const response = await API.get(`/bookings/public/${reference}`);

        if (!ignore) {
          setBooking(response.data);
          setError("");
        }
      } catch (requestError) {
        if (!ignore) {
          setError(
            requestError.response?.data?.message ||
              "We could not load your booking review.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadBooking();

    return () => {
      ignore = true;
    };
  }, [booking, reference]);

  return (
    <main className="booking-page booking-status-page">
      <section className="booking-card booking-status-card">
        <p className="booking-status-card__eyebrow">Booking review</p>
        <h1 className="booking-card__title">Your booking is saved</h1>
        <div className="download-btn">
          <button
            className="btn btn--dark"
            onClick={() =>
              downloadBookingCard({
                element: cardRef.current,
                filename: `${reference}-reference.png`,
              })
            }
            type="button"
          >
            Download reference
          </button>
        </div>
        <p className="booking-card__text">
          Keep your reference safe. You can download it now and use it later to
          track your booking status.
        </p>

        {state?.bookingMessage ? (
          <p className="form-status form-status--success">
            {state.bookingMessage}
          </p>
        ) : null}
        {isLoading ? (
          <p className="field__hint">Loading booking review...</p>
        ) : null}
        {error ? (
          <p className="form-status form-status--error">{error}</p>
        ) : null}

        {booking ? (
          <div className="booking-reference-poster" ref={cardRef}>
            <div className="booking-status-card__header">
              <div>
                <span className="booking-detail__label">Reference: </span>
                <strong className="booking-status-card__reference">
                  {booking.reference}
                </strong>
              </div>
              <span className={`status status--${booking.status}`}>
                {booking.status}
              </span>
            </div>

            <div className="booking-status-grid">
              <div className="booking-detail">
                <span className="booking-detail__label">Client</span>
                <strong>{booking.name}</strong>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Phone</span>
                <strong>{booking.phone}</strong>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Email</span>
                <strong>{booking.email || "No email provided"}</strong>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Code</span>
                <strong>{booking.code}</strong>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Service</span>
                <strong>{booking.service}</strong>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Date</span>
                <strong>{formatDate(booking.date)}</strong>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Time</span>
                <strong>{formatTime(booking.time)}</strong>
              </div>
            </div>
          </div>
        ) : null}

        <div className="booking-status-card__actions">
          <Link
            className="btn btn--secondary"
            to={`/booking/status/${reference}`}
          >
            Track your booking
          </Link>
        </div>
      </section>
    </main>
  );
}
