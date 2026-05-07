import {
  applyForBookingDb, getApplicantsByBookingDb,
  checkExistingApplicationDb, getCleanerApplicationsDb
} from "../models/applicantDb.js"
import { getBookingByIdDb } from "../models/bookingDb.js"

const applyForBookingCon = async (req, res) => {
  try {
    const { id: cleaner_id } = req.user
    const { booking_id } = req.params

    const booking = await getBookingByIdDb(booking_id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    if (booking.status !== 'open') {
      return res.status(400).json({ message: "Booking is no longer accepting applicants" })
    }

    const existing = await checkExistingApplicationDb(booking_id, cleaner_id)
    if (existing) {
      return res.status(400).json({ message: "You already applied for this booking" })
    }

    await applyForBookingDb(booking_id, cleaner_id)
    res.status(201).json({ message: "Application submitted — waiting for house approval" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getApplicantsByBookingCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const { booking_id } = req.params

    const booking = await getBookingByIdDb(booking_id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    if (booking.house_id !== house_id) {
      return res.status(403).json({ message: "Not your booking" })
    }

    const applicants = await getApplicantsByBookingDb(booking_id)
    res.json(applicants)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getMyApplicationsCon = async (req, res) => {
  try {
    const { id: cleaner_id } = req.user
    const applications = await getCleanerApplicationsDb(cleaner_id)
    res.json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { applyForBookingCon, getApplicantsByBookingCon, getMyApplicationsCon }