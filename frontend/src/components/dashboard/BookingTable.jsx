export default function BookingTable({ bookings }) {
  return (
    <table className="booking-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking, i) => (
          <tr key={i}>
            <td>{booking.name}</td>
            <td>{booking.code}</td>
            <td>{booking.date}</td>
            <td>{booking.time}</td>
            <td>
              <span className={`status ${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
