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

const formatDateTime = (value) => {
  if (!value) {
    return "Waiting for first update";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Waiting for first update";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function BookingStatus() {
  const { reference } = useParams();
  const { state } = useLocation();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    const loadBookingStatus = async () => {
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
              "We could not load your booking status.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadBookingStatus();
    const intervalId = window.setInterval(loadBookingStatus, 15000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [reference]);

  return (
    <main className="booking-page booking-status-page">
      <section className="booking-card booking-status-card">
        <p className="booking-status-card__eyebrow">Client booking status</p>
        <h1 className="booking-card__title">Track your booking</h1>
        <p className="booking-card__text">
          Your booking status updates here when the owner confirms your lesson.
        </p>

        {isLoading ? (
          <p className="field__hint">Loading booking status...</p>
        ) : null}
        {error ? (
          <p className="form-status form-status--error">{error}</p>
        ) : null}
        {state?.bookingMessage ? (
          <p className="form-status form-status--success">
            {state.bookingMessage}
          </p>
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
              <div className="booking-status-card__meta">
                <span className="booking-status-card__last-seen">
                  Last seen{" "}
                  {formatDateTime(booking.updated_at || booking.created_at)}
                </span>
                <span className={`status status--${booking.status}`}>
                  {booking.status}
                </span>
              </div>
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
                <span className="booking-detail__label">Lesson date</span>
                <strong>{formatDate(booking.date)}</strong>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Lesson time</span>
                <strong>{formatTime(booking.time)}</strong>
              </div>
              <div className="booking-detail booking-detail--wide">
                <span className="booking-detail__label">Status meaning</span>
                <strong>
                  {booking.status === "confirmed"
                    ? "Confirmed means your booking has been approved by the owner."
                    : "Pending means the owner has received your booking and has not confirmed it yet."}
                </strong>
              </div>
            </div>
          </div>
        ) : null}

        <div className="booking-status-card__actions">
          <button
            className="btn btn--dark"
            onClick={() =>
              downloadBookingCard({
                element: cardRef.current,
                filename: `${reference}-status.png`,
              })
            }
            type="button"
          >
            Download reference
          </button>
          <Link className="btn btn--secondary" to="/">
            Done
          </Link>
          <Link className="btn btn--secondary" to="/booking">
            Make another booking
          </Link>
        </div>
      </section>
    </main>
  );
}
