import db from "../config/db.js";
import { sendWhatsApp } from "../utils/whatsapp.js";

const BOOKING_STATUSES = new Set([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

const normalizeBookingPayload = (body) => ({
  name: body.name?.trim(),
  email: body.email?.trim().toLowerCase(),
  phone: body.phone?.trim(),
  code: body.code ?? body.selectedCode,
  service: body.service ?? body.selectedService,
  date: body.date ?? body.bookingDate,
  time: body.time ?? body.bookingTime,
});

const normalizeTimeValue = (value) => String(value).slice(0, 5);
const getSchoolId = (req) => req.user?.school_id ?? req.body.school_id ?? null;

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

const buildBookingsFilter = ({ schoolId, status, search }) => {
  const conditions = ["school_id <=> ?"];
  const values = [schoolId];

  if (status) {
    conditions.push("status = ?");
    values.push(status);
  }

  if (search) {
    conditions.push(
      "(customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ? OR code LIKE ? OR service LIKE ?)",
    );
    const searchPattern = `%${search}%`;
    values.push(
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
    );
  }

  return { whereClause: conditions.join(" AND "), values };
};

export const createBooking = async (req, res) => {
  const booking = normalizeBookingPayload(req.body);
  const schoolId = getSchoolId(req);
  const { name, phone, code, service, date, time } = booking;

  if (!name || !phone || !code || !service || !date || !time) {
    return res.status(400).json({
      message:
        "Name, phone, code, service, booking date, and booking time are required",
    });
  }

  try {
    const duplicateSlot = await query(
      "SELECT id FROM bookings WHERE booking_date = ? AND booking_time = ? AND school_id <=> ? LIMIT 1",
      [date, time, schoolId],
    );

    if (duplicateSlot.length > 0) {
      return res
        .status(409)
        .json({ message: "This date and time is already booked" });
    }

    const result = await query(
      "INSERT INTO bookings (customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, school_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        booking.email ?? null,
        phone,
        code,
        service,
        date,
        time,
        "pending",
        schoolId,
      ],
    );

    try {
      await sendWhatsApp(phone, "Booking received. We will contact you soon.");
    } catch (whatsAppError) {
      console.error("Failed to send WhatsApp confirmation:", whatsAppError);
    }

    return res.status(201).json({
      message: "Booking created",
      booking: {
        id: result.insertId,
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
  } catch (error) {
    return res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getBookings = async (req, res) => {
  const schoolId = req.user?.school_id ?? req.query.school_id ?? null;
  const status = req.query.status?.trim().toLowerCase();
  const search = req.query.search?.trim();

  if (status && !BOOKING_STATUSES.has(status)) {
    return res.status(400).json({ message: "Invalid booking status filter" });
  }

  try {
    const { whereClause, values } = buildBookingsFilter({
      schoolId,
      status,
      search,
    });

    const results = await query(
      `SELECT id, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, school_id, created_at, updated_at
       FROM bookings
       WHERE ${whereClause}
       ORDER BY booking_date ASC, booking_time ASC, created_at DESC`,
      values,
    );

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const getBookingSummary = async (req, res) => {
  const schoolId = req.user?.school_id ?? req.query.school_id ?? null;

  try {
    const [summaryRows] = await Promise.all([
      query(
        `SELECT
           COUNT(*) AS total_bookings,
           COUNT(DISTINCT COALESCE(NULLIF(customer_email, ''), customer_phone)) AS total_clients,
           SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_bookings,
           SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_bookings,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_bookings,
           SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_bookings,
           SUM(CASE WHEN booking_date = CURDATE() THEN 1 ELSE 0 END) AS today_bookings,
           SUM(CASE WHEN booking_date >= CURDATE() THEN 1 ELSE 0 END) AS upcoming_bookings
         FROM bookings
         WHERE school_id <=> ?`,
        [schoolId],
      ),
    ]);

    const recentClients = await query(
      `SELECT id, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, created_at
       FROM bookings
       WHERE school_id <=> ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [schoolId],
    );

    return res.json({
      summary: summaryRows[0],
      recentClients,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch booking summary" });
  }
};

export const updateBookingStatus = async (req, res) => {
  const schoolId = req.user?.school_id ?? null;
  const bookingId = Number(req.params.id);
  const status = req.body.status?.trim().toLowerCase();

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({ message: "Invalid booking id" });
  }

  if (!BOOKING_STATUSES.has(status)) {
    return res.status(400).json({ message: "Invalid booking status" });
  }

  try {
    const result = await query(
      "UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND school_id <=> ?",
      [status, bookingId, schoolId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const [booking] = await query(
      `SELECT id, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, created_at, updated_at
       FROM bookings
       WHERE id = ?`,
      [bookingId],
    );

    return res.json({
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update booking status" });
  }
};

export const getUnavailableSlots = async (req, res) => {
  const { date } = req.query;
  const schoolId = req.user?.school_id ?? req.query.school_id ?? null;

  if (!date) {
    return res
      .status(400)
      .json({ message: "date query parameter is required" });
  }

  try {
    const results = await query(
      "SELECT booking_time FROM bookings WHERE booking_date = ? AND school_id <=> ? AND status != 'cancelled'",
      [date, schoolId],
    );

    const times = results.map((row) => row.booking_time);
    return res.json(times.map(normalizeTimeValue));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch unavailable slots" });
  }
};
