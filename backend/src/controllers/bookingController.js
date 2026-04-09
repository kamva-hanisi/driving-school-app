import db from "../config/db.js";
import { sendWhatsApp } from "../utils/whatsapp.js";

const normalizeBookingPayload = (body) => ({
  name: body.name?.trim(),
  email: body.email?.trim(),
  phone: body.phone?.trim(),
  code: body.code ?? body.selectedCode,
  service: body.service ?? body.selectedService,
  date: body.date ?? body.bookingDate,
  time: body.time ?? body.bookingTime,
});

const normalizeTimeValue = (value) => String(value).slice(0, 5);
const getSchoolId = (req) => req.user?.school_id ?? req.body.school_id ?? null;
const isMissingSchoolIdColumn = (error) => error?.code === "ER_BAD_FIELD_ERROR";

const runDuplicateSlotCheck = (date, time, schoolId, callback) => {
  db.query(
    "SELECT id FROM bookings WHERE booking_date = ? AND booking_time = ? AND school_id <=> ? LIMIT 1",
    [date, time, schoolId],
    (error, results) => {
      if (!isMissingSchoolIdColumn(error)) {
        return callback(error, results);
      }

      return db.query(
        "SELECT id FROM bookings WHERE booking_date = ? AND booking_time = ? LIMIT 1",
        [date, time],
        callback,
      );
    },
  );
};

const runBookingInsert = (booking, schoolId, callback) => {
  const values = [
    booking.name,
    booking.email ?? null,
    booking.phone,
    booking.code,
    booking.service,
    booking.date,
    booking.time,
    "pending",
    schoolId,
  ];

  db.query(
    "INSERT INTO bookings (customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, school_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    values,
    (error, results) => {
      if (!isMissingSchoolIdColumn(error)) {
        return callback(error, results);
      }

      return db.query(
        "INSERT INTO bookings (customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        values.slice(0, 8),
        callback,
      );
    },
  );
};

const runBookingsQuery = (schoolId, callback) => {
  db.query(
    "SELECT * FROM bookings WHERE school_id <=> ? ORDER BY booking_date ASC, booking_time ASC",
    [schoolId],
    (error, results) => {
      if (!isMissingSchoolIdColumn(error)) {
        return callback(error, results);
      }

      return db.query(
        "SELECT * FROM bookings ORDER BY booking_date ASC, booking_time ASC",
        callback,
      );
    },
  );
};

const runUnavailableSlotsQuery = (date, schoolId, callback) => {
  db.query(
    "SELECT booking_time FROM bookings WHERE booking_date = ? AND school_id <=> ?",
    [date, schoolId],
    (error, results) => {
      if (!isMissingSchoolIdColumn(error)) {
        return callback(error, results);
      }

      return db.query(
        "SELECT booking_time FROM bookings WHERE booking_date = ?",
        [date],
        callback,
      );
    },
  );
};

export const createBooking = (req, res) => {
  const booking = normalizeBookingPayload(req.body);
  const schoolId = getSchoolId(req);
  const { name, phone, code, service, date, time } = booking;

  if (!name || !phone || !code || !service || !date || !time) {
    return res.status(400).json({
      message:
        "Name, phone, code, service, booking date, and booking time are required",
    });
  }

  // Prevents two customers from claiming the same booking slot.
  runDuplicateSlotCheck(
    date,
    time,
    schoolId,
    (selectError, results) => {
      if (selectError) {
        return res
          .status(500)
          .json({ message: "Failed to check booking slot" });
      }

      if (results.length > 0) {
        return res
          .status(409)
          .json({ message: "This date and time is already booked" });
      }

      runBookingInsert(
        { ...booking, name, phone, code, service, date, time },
        schoolId,
        async (insertError) => {
          if (insertError) {
            return res
              .status(500)
              .json({ message: "Failed to create booking" });
          }

          try {
            await sendWhatsApp(phone, "Booking confirmed!");
          } catch (whatsAppError) {
            console.error("Failed to send WhatsApp confirmation:", whatsAppError);
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
              school_id: schoolId,
              status: "pending",
            },
          });
        },
      );
    },
  );
};

export const getBookings = (req, res) => {
  const schoolId = req.user?.school_id ?? req.query.school_id ?? null;

  runBookingsQuery(
    schoolId,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch bookings" });
      }

      return res.json(results);
    },
  );
};

export const getUnavailableSlots = (req, res) => {
  const { date } = req.query;
  const schoolId = req.user?.school_id ?? req.query.school_id ?? null;

  if (!date) {
    return res
      .status(400)
      .json({ message: "date query parameter is required" });
  }

  runUnavailableSlotsQuery(
    date,
    schoolId,
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      const times = results.map((row) => row.booking_time);
      return res.json(times.map(normalizeTimeValue));
    },
  );
};
