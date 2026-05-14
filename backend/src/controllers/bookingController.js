import db from "../config/db.js";
import { sendWhatsApp } from "../utils/whatsapp.js";
import crypto from "crypto";

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
const createPublicReference = () =>
  `DRV-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

const query = (sql, values = []) =>
  db.query(sql, values).then((result) => result.rows);

const buildBookingsFilter = ({ schoolId, status, search }) => {
  const conditions = ["school_id IS NOT DISTINCT FROM $1"];
  const values = [schoolId];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (search) {
    const searchPattern = `%${search}%`;
    const startIndex = values.length + 1;
    conditions.push(
      `(customer_name ILIKE $${startIndex}
        OR customer_email ILIKE $${startIndex + 1}
        OR customer_phone ILIKE $${startIndex + 2}
        OR code ILIKE $${startIndex + 3}
        OR service ILIKE $${startIndex + 4})`,
    );
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
      `SELECT id
       FROM bookings
       WHERE booking_date = $1
         AND booking_time = $2
         AND school_id IS NOT DISTINCT FROM $3
       LIMIT 1`,
      [date, time, schoolId],
    );

    if (duplicateSlot.length > 0) {
      return res
        .status(409)
        .json({ message: "This date and time is already booked" });
    }

    const [createdBooking] = await query(
      `INSERT INTO bookings
       (customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, school_id, public_reference)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, public_reference, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, school_id, created_at, updated_at`,
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
        createPublicReference(),
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
        id: createdBooking.id,
        reference: createdBooking.public_reference,
        name: createdBooking.customer_name,
        email: createdBooking.customer_email,
        phone: createdBooking.customer_phone,
        code: createdBooking.code,
        service: createdBooking.service,
        date: createdBooking.booking_date,
        time: createdBooking.booking_time,
        school_id: createdBooking.school_id,
        status: createdBooking.status,
        created_at: createdBooking.created_at,
        updated_at: createdBooking.updated_at,
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
      `SELECT id, public_reference, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, school_id, created_at, updated_at
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
           COUNT(*)::int AS total_bookings,
           COUNT(DISTINCT COALESCE(NULLIF(customer_email, ''), customer_phone))::int AS total_clients,
           COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_bookings,
           COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_bookings,
           COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_bookings,
           COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_bookings,
           COUNT(*) FILTER (WHERE booking_date = CURRENT_DATE)::int AS today_bookings,
           COUNT(*) FILTER (WHERE booking_date >= CURRENT_DATE)::int AS upcoming_bookings
         FROM bookings
         WHERE school_id IS NOT DISTINCT FROM $1`,
        [schoolId],
      ),
    ]);

    const recentClients = await query(
      `SELECT id, public_reference, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, created_at
       FROM bookings
       WHERE school_id IS NOT DISTINCT FROM $1
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
    const [booking] = await query(
      `UPDATE bookings
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND school_id IS NOT DISTINCT FROM $3
       RETURNING id, public_reference, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, created_at, updated_at`,
      [status, bookingId, schoolId],
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update booking status" });
  }
};

export const getPublicBookingStatus = async (req, res) => {
  const reference = req.params.reference?.trim().toUpperCase();

  if (!reference) {
    return res.status(400).json({ message: "Booking reference is required" });
  }

  try {
    const [booking] = await query(
      `SELECT public_reference, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, created_at, updated_at
       FROM bookings
       WHERE public_reference = $1
       LIMIT 1`,
      [reference],
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({
      reference: booking.public_reference,
      name: booking.customer_name,
      email: booking.customer_email,
      phone: booking.customer_phone,
      code: booking.code,
      service: booking.service,
      date: booking.booking_date,
      time: booking.booking_time,
      status: booking.status,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch booking status" });
  }
};

export const updatePublicBookingDetails = async (req, res) => {
  const reference = req.params.reference?.trim().toUpperCase();
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase() || null;
  const phone = req.body.phone?.trim();

  if (!reference) {
    return res.status(400).json({ message: "Booking reference is required" });
  }

  if (!name || !phone) {
    return res.status(400).json({
      message: "Client name and phone number are required.",
    });
  }

  try {
    const [booking] = await query(
      `UPDATE bookings
       SET customer_name = $1, customer_email = $2, customer_phone = $3, updated_at = CURRENT_TIMESTAMP
       WHERE public_reference = $4
       RETURNING public_reference, customer_name, customer_email, customer_phone, code, service, booking_date, booking_time, status, created_at, updated_at`,
      [name, email, phone, reference],
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({
      message: "Booking details updated",
      booking: {
        reference: booking.public_reference,
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
        code: booking.code,
        service: booking.service,
        date: booking.booking_date,
        time: booking.booking_time,
        status: booking.status,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update booking details" });
  }
};

export const deleteBooking = async (req, res) => {
  const schoolId = req.user?.school_id ?? null;
  const bookingId = Number(req.params.id);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({ message: "Invalid booking id" });
  }

  try {
    const deletedBookings = await query(
      `DELETE FROM bookings
       WHERE id = $1 AND school_id IS NOT DISTINCT FROM $2
       RETURNING id`,
      [bookingId, schoolId],
    );

    if (deletedBookings.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ message: "Booking deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete booking" });
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
      `SELECT booking_time
       FROM bookings
       WHERE booking_date = $1
         AND school_id IS NOT DISTINCT FROM $2
         AND status <> 'cancelled'`,
      [date, schoolId],
    );

    const times = results.map((row) => row.booking_time);
    return res.json(times.map(normalizeTimeValue));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch unavailable slots" });
  }
};
