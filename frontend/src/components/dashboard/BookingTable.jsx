const formatDate = (value) =>
  new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const formatTime = (value) => String(value).slice(0, 5);

export default function BookingTable({ bookings, onStatusChange }) {
  if (bookings.length === 0) {
    return <p className="field__hint">No bookings match the current filters.</p>;
  }

  return (
    <div className="booking-list">
      {bookings.map((booking) => (
        <article className="booking-card-item" key={booking.id}>
          <div className="booking-card-item__top">
            <div>
              <p className="booking-card-item__eyebrow">Client booking</p>
              <h3 className="booking-card-item__name">{booking.customer_name}</h3>
            </div>
            <span className={`status status--${booking.status.toLowerCase()}`}>
              {booking.status}
            </span>
          </div>

          <div className="booking-card-item__grid">
            <div className="booking-detail">
              <span className="booking-detail__label">Phone</span>
              <strong>{booking.customer_phone}</strong>
            </div>

            <div className="booking-detail">
              <span className="booking-detail__label">Email</span>
              <strong>{booking.customer_email || "No email provided"}</strong>
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
              <strong>{formatDate(booking.booking_date)}</strong>
            </div>

            <div className="booking-detail">
              <span className="booking-detail__label">Time</span>
              <strong>{formatTime(booking.booking_time)}</strong>
            </div>
          </div>

          <div className="booking-card-item__footer">
            <label className="booking-card-item__control">
              <span className="booking-detail__label">Update status</span>
              <select
                className="booking-table__status-select"
                onChange={(event) =>
                  onStatusChange(booking.id, event.target.value)
                }
                value={booking.status}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>

            <button
              className="btn btn--danger booking-table__delete"
              onClick={() => onStatusChange(booking.id, "delete")}
              type="button"
            >
              Delete booking
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
