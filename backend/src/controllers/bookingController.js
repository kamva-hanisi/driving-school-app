import db from "../config/db.js";

const normalizeBookingPayload = (body) => ({
  name: body.name?.trim(),
  email: body.email?.trim(),
  phone: body.phone?.trim(),
  code: body.code ?? body.selectedCode,
  service: body.service ?? body.selectedService,
  date: body.date ?? body.bookingDate,
  time: body.time ?? body.bookingTime,
});

export const createBooking = (req, res) => {
  const booking = normalizeBookingPayload(req.body);
  const { name, phone, code, service, date, time } = booking;

  if (!name || !phone || !code || !service || !date || !time) {
    return res.status(400).json({
      message:
        "Name, phone, code, service, booking date, and booking time are required",
    });
  }

  // Prevents two customers from claiming the same booking slot.
  db.query(
    "SELECT id FROM bookings WHERE booking_date = ? AND booking_time = ? LIMIT 1",
    [date, time],
    (selectError, results) => {
      if (selectError) {
        return res.status(500).json({ message: "Failed to check booking slot" });
      }

      if (results.length > 0) {
        return res
          .status(409)
          .json({ message: "This date and time is already booked" });
      }

      db.query(
        "INSERT INTO bookings (customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [name, booking.email ?? null, phone, code, service, date, time, "pending"],
        (insertError) => {
          if (insertError) {
            return res.status(500).json({ message: "Failed to create booking" });
          }

          return res.status(201).json({
            message: "Booking created",
            booking: {
              name,
              email: booking.email ?? null,
              phone,
              code,
              service,
              date,
              time,
              status: "pending",
            },
          });
        },
      );
    },
  );
};

export const getBookings = (req, res) => {
  db.query(
    "SELECT * FROM bookings ORDER BY booking_date ASC, booking_time ASC",
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch bookings" });
      }

      return res.json(results);
    },
  );
};
