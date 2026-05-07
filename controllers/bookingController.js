import {
  createBookingDb, getOpenBookingsDb, getBookingsByHouseDb,
  getBookingByIdDb, approveBookingDb, updateBookingStatusDb,
  cancelBookingDb, verifyBookingDb
} from "../models/bookingDb.js"
import { approveApplicantDb } from "../models/applicantDb.js"
import { pool } from "../config/config.js"

const createBookingCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const { bin_id, scheduled_date } = req.body
    const data = await createBookingDb(house_id, bin_id, scheduled_date)
    res.status(201).json({
      message: "Booking created — waiting for cleaners to apply",
      booking_id: data.insertId
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getOpenBookingsCon = async (req, res) => {
  try {
    const bookings = await getOpenBookingsDb()
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getMyBookingsCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const bookings = await getBookingsByHouseDb(house_id)
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getBookingByIdCon = async (req, res) => {
  try {
    const { id } = req.params
    const booking = await getBookingByIdDb(id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    res.json(booking)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// house approves a cleaner from the applicant list
// this also triggers applicant approval + cleaner status → busy
const approveBookingCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const { booking_id } = req.params
    const { cleaner_id } = req.body

    const booking = await getBookingByIdDb(booking_id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    if (booking.house_id !== house_id) {
      return res.status(403).json({ message: "Not your booking" })
    }
    if (booking.status !== 'open') {
      return res.status(400).json({ message: "Booking is no longer open" })
    }

    // approve booking + handle all applicants in one go
    await approveBookingDb(booking_id, cleaner_id)
    await approveApplicantDb(booking_id, cleaner_id)

    // set cleaner status → busy
    await pool.query(
      `UPDATE cleaner SET status = 'busy' WHERE cleaner_id = ?`,
      [cleaner_id]
    )

    res.json({ message: "Cleaner approved — booking confirmed" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const cancelBookingCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const { id: booking_id } = req.params
    const data = await cancelBookingDb(booking_id, house_id)
    if (data.affectedRows === 0) {
      return res.status(400).json({ message: "Cannot cancel — booking not found or already closed" })
    }
    res.json({ message: "Booking cancelled" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// QR code verification endpoint
// frontend scans QR → sends booking_id, cleaner_id, bin_id
// backend confirms all three match an approved/in_progress booking
const verifyBookingCon = async (req, res) => {
  try {
    const { booking_id, cleaner_id, bin_id } = req.query
    const booking = await verifyBookingDb(booking_id, cleaner_id, bin_id)
    if (!booking) {
      return res.status(400).json({
        verified: false,
        message: "Verification failed — cleaner or bin does not match this booking"
      })
    }
    res.json({
      verified: true,
      message: "Verified — safe to hand over bin",
      booking
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export {
  createBookingCon, getOpenBookingsCon, getMyBookingsCon,
  getBookingByIdCon, approveBookingCon, cancelBookingCon, verifyBookingCon
}