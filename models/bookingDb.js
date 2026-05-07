import { pool } from "../config/config.js"

const createBookingDb = async (house_id, bin_id, scheduled_date) => {
  const [data] = await pool.query(
    `INSERT INTO booking (house_id, bin_id, scheduled_date, status)
     VALUES (?, ?, ?, 'open')`,
    [house_id, bin_id, scheduled_date]
  )
  return data
}

// all open bookings — cleaners browse this
const getOpenBookingsDb = async () => {
  const [data] = await pool.query(
    `SELECT b.booking_id, b.scheduled_date, b.status,
            bn.bin_id, bn.bin_code, bn.photo AS bin_photo,
            h.house_id, h.first_name, h.last_name
     FROM booking b
     JOIN bin bn ON b.bin_id = bn.bin_id
     JOIN house h ON b.house_id = h.house_id
     WHERE b.status = 'open'
     ORDER BY b.scheduled_date ASC`
  )
  return data
}

// bookings made by a specific house
const getBookingsByHouseDb = async (house_id) => {
  const [data] = await pool.query(
    `SELECT b.*, bn.bin_code, bn.photo AS bin_photo,
            c.first_name AS cleaner_first_name, c.last_name AS cleaner_last_name,
            c.photo AS cleaner_photo
     FROM booking b
     JOIN bin bn ON b.bin_id = bn.bin_id
     LEFT JOIN cleaner c ON b.cleaner_id = c.cleaner_id
     WHERE b.house_id = ?
     ORDER BY b.scheduled_date DESC`,
    [house_id]
  )
  return data
}

const getBookingByIdDb = async (booking_id) => {
  const [data] = await pool.query(
    `SELECT b.*, bn.bin_code, bn.photo AS bin_photo,
            c.first_name AS cleaner_first_name, c.last_name AS cleaner_last_name,
            c.photo AS cleaner_photo
     FROM booking b
     JOIN bin bn ON b.bin_id = bn.bin_id
     LEFT JOIN cleaner c ON b.cleaner_id = c.cleaner_id
     WHERE b.booking_id = ?`,
    [booking_id]
  )
  return data[0]
}

// house approves a cleaner — sets cleaner_id and status
const approveBookingDb = async (booking_id, cleaner_id) => {
  const [data] = await pool.query(
    `UPDATE booking SET cleaner_id = ?, status = 'approved'
     WHERE booking_id = ? AND status = 'open'`,
    [cleaner_id, booking_id]
  )
  return data
}

const updateBookingStatusDb = async (booking_id, status) => {
  const [data] = await pool.query(
    `UPDATE booking SET status = ? WHERE booking_id = ?`,
    [status, booking_id]
  )
  return data
}

const cancelBookingDb = async (booking_id, house_id) => {
  const [data] = await pool.query(
    `UPDATE booking SET status = 'cancelled'
     WHERE booking_id = ? AND house_id = ? AND status = 'open'`,
    [booking_id, house_id]
  )
  return data
}

// QR verify — checks booking, cleaner, and bin all match
const verifyBookingDb = async (booking_id, cleaner_id, bin_id) => {
  const [data] = await pool.query(
    `SELECT booking_id, cleaner_id, bin_id, status
     FROM booking
     WHERE booking_id = ? AND cleaner_id = ? AND bin_id = ?
     AND status IN ('approved', 'in_progress')`,
    [booking_id, cleaner_id, bin_id]
  )
  return data[0]
}

export {
  createBookingDb, getOpenBookingsDb, getBookingsByHouseDb,
  getBookingByIdDb, approveBookingDb, updateBookingStatusDb,
  cancelBookingDb, verifyBookingDb
}