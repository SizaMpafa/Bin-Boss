import { pool } from "../config/config.js"

// cleaner raises hand for a booking
const applyForBookingDb = async (booking_id, cleaner_id) => {
  const [data] = await pool.query(
    `INSERT INTO booking_applicant (booking_id, cleaner_id, status)
     VALUES (?, ?, 'pending')`,
    [booking_id, cleaner_id]
  )
  return data
}

// house sees all applicants for their booking (with photo for trust)
const getApplicantsByBookingDb = async (booking_id) => {
  const [data] = await pool.query(
    `SELECT ba.applicant_id, ba.status, ba.applied_at,
            c.cleaner_id, c.first_name, c.last_name,
            c.photo, c.contact, c.id_number
     FROM booking_applicant ba
     JOIN cleaner c ON ba.cleaner_id = c.cleaner_id
     WHERE ba.booking_id = ?
     ORDER BY ba.applied_at ASC`,
    [booking_id]
  )
  return data
}

// approve one applicant — decline all others for same booking
const approveApplicantDb = async (booking_id, cleaner_id) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // approve the chosen one
    await conn.query(
      `UPDATE booking_applicant SET status = 'approved'
       WHERE booking_id = ? AND cleaner_id = ?`,
      [booking_id, cleaner_id]
    )

    // decline everyone else
    await conn.query(
      `UPDATE booking_applicant SET status = 'declined'
       WHERE booking_id = ? AND cleaner_id != ?`,
      [booking_id, cleaner_id]
    )

    await conn.commit()
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

// check if cleaner already applied
const checkExistingApplicationDb = async (booking_id, cleaner_id) => {
  const [data] = await pool.query(
    `SELECT applicant_id FROM booking_applicant
     WHERE booking_id = ? AND cleaner_id = ?`,
    [booking_id, cleaner_id]
  )
  return data[0]
}

// bookings a specific cleaner applied to
const getCleanerApplicationsDb = async (cleaner_id) => {
  const [data] = await pool.query(
    `SELECT ba.applicant_id, ba.status, ba.applied_at,
            b.booking_id, b.scheduled_date, b.status AS booking_status,
            bn.bin_code, bn.photo AS bin_photo
     FROM booking_applicant ba
     JOIN booking b ON ba.booking_id = b.booking_id
     JOIN bin bn ON b.bin_id = bn.bin_id
     WHERE ba.cleaner_id = ?
     ORDER BY ba.applied_at DESC`,
    [cleaner_id]
  )
  return data
}

export {
  applyForBookingDb, getApplicantsByBookingDb, approveApplicantDb,
  checkExistingApplicationDb, getCleanerApplicationsDb
}