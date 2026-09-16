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

export default function BookingReview() {
  const { reference } = useParams();
  const { state } = useLocation();
  const [booking, setBooking] = useState(state?.booking || null);
  const [draft, setDraft] = useState({
    name: state?.booking?.name || "",
    phone: state?.booking?.phone || "",
    email: state?.booking?.email || "",
  });
  const [editingField, setEditingField] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    state?.bookingMessage || "",
  );
  const [isLoading, setIsLoading] = useState(
    !state?.booking ||
      (!state.booking.created_at && !state.booking.updated_at),
  );
  const [isSaving, setIsSaving] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (booking?.created_at || booking?.updated_at) {
      return;
    }

    let ignore = false;

    const loadBooking = async () => {
      try {
        const response = await API.get(`/bookings/public/${reference}`);

        if (!ignore) {
          setBooking(response.data);
          setDraft({
            name: response.data.name || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
          });
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
  }, [booking?.created_at, booking?.updated_at, reference]);

  useEffect(() => {
    if (!booking) {
      return;
    }

    setDraft({
      name: booking.name || "",
      phone: booking.phone || "",
      email: booking.email || "",
    });
  }, [booking]);

  const handleDraftChange = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleEditStart = (field) => {
    setEditingField(field);
    setSuccessMessage("");
    setError("");
  };

  const handleEditCancel = () => {
    setEditingField("");
    setSuccessMessage("");
    setError("");
    setDraft({
      name: booking?.name || "",
      phone: booking?.phone || "",
      email: booking?.email || "",
    });
  };

  const handleSaveDetails = async () => {
    try {
      setIsSaving(true);
      setError("");

      const response = await API.patch(`/bookings/public/${reference}`, {
        name: draft.name,
        phone: draft.phone,
        email: draft.email,
      });

      setBooking(response.data.booking);
      setDraft({
        name: response.data.booking.name || "",
        phone: response.data.booking.phone || "",
        email: response.data.booking.email || "",
      });
      setSuccessMessage(
        response.data.message || "Booking details updated successfully.",
      );
      setEditingField("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "We could not update your booking details.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditableField = (field, label) => {
    const value = draft[field] || "";
    const displayValue =
      field === "email" ? value || "No email provided" : value || "Not provided";
    const inputType = field === "email" ? "email" : "text";
    const placeholderMap = {
      name: "Your full name",
      phone: "Your phone number",
      email: "you@example.com",
    };

    return (
      <div className="booking-detail booking-detail--editable">
        <div className="booking-detail__row">
          <span className="booking-detail__label">{label}</span>
          {editingField === field ? (
            <button
              className="booking-detail__edit"
              onClick={handleEditCancel}
              type="button"
            >
              Cancel
            </button>
          ) : (
            <button
              className="booking-detail__edit"
              onClick={() => handleEditStart(field)}
              type="button"
            >
              Edit
            </button>
          )}
        </div>

        {editingField === field ? (
          <>
            <input
              className="field__input booking-detail__input"
              onChange={(event) => handleDraftChange(field, event.target.value)}
              placeholder={placeholderMap[field]}
              type={inputType}
              value={value}
            />
            <button
              className="btn btn--dark booking-detail__save"
              disabled={isSaving}
              onClick={handleSaveDetails}
              type="button"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <strong>{displayValue}</strong>
        )}
      </div>
    );
  };

  return (
    <main className="booking-page booking-status-page">
      <section className="booking-card booking-status-card">
        <p className="booking-status-card__eyebrow">Booking review</p>
        <h1 className="booking-card__title">Your booking is saved</h1>
        <p className="booking-card__text">
          Keep your reference safe. You can download it now and use it later to
          track your booking status.
        </p>

        {successMessage ? (
          <p className="form-status form-status--success">{successMessage}</p>
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
              {renderEditableField("name", "Client")}
              {renderEditableField("phone", "Phone")}
              {renderEditableField("email", "Email")}
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

        <div className="booking-status-card__actions booking-status-card__actions--spread">
          <div className="booking-status-card__actions-left">
            <Link className="btn btn--secondary" to="/booking">
              Back
            </Link>
            <Link
              className="btn btn--secondary"
              to={`/booking/status/${reference}`}
            >
              Track your booking
            </Link>
          </div>
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
      </section>
    </main>
  );
}
