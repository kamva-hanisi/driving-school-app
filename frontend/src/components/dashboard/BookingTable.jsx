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
    <table className="booking-table">
      <thead>
        <tr>
          <th>Client</th>
          <th>Contact</th>
          <th>Code</th>
          <th>Service</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking.id}>
            <td>{booking.customer_name}</td>
            <td>
              <div className="booking-table__contact">
                <span>{booking.customer_phone}</span>
                <span>{booking.customer_email || "No email"}</span>
              </div>
            </td>
            <td>{booking.code}</td>
            <td>{booking.service}</td>
            <td>{formatDate(booking.booking_date)}</td>
            <td>{formatTime(booking.booking_time)}</td>
            <td>
              <span className={`status status--${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </td>
            <td>
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
