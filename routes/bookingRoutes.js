import express from "express"
import {
  createBookingCon, getOpenBookingsCon, getMyBookingsCon,
  getBookingByIdCon, approveBookingCon, cancelBookingCon, verifyBookingCon
} from "../controllers/bookingController.js"
import {
  applyForBookingCon, getApplicantsByBookingCon, getMyApplicationsCon
} from "../controllers/applicantController.js"
import { verifyToken, requireRole } from "../middleware/authMiddleware.js"

const router = express.Router()

// public — cleaners browse open jobs
router.get("/open", getOpenBookingsCon)

// QR verification — house scans before handover and on return
router.get("/verify", verifyToken, verifyBookingCon)

// house only
router.post("/", verifyToken, requireRole("house"), createBookingCon)
router.get("/my-bookings", verifyToken, requireRole("house"), getMyBookingsCon)
router.put("/:booking_id/approve", verifyToken, requireRole("house"), approveBookingCon)
router.put("/:id/cancel", verifyToken, requireRole("house"), cancelBookingCon)
router.get("/:booking_id/applicants", verifyToken, requireRole("house"), getApplicantsByBookingCon)

// cleaner only
router.post("/:booking_id/apply", verifyToken, requireRole("cleaner"), applyForBookingCon)
router.get("/my-applications", verifyToken, requireRole("cleaner"), getMyApplicationsCon)

// both roles
router.get("/:id", verifyToken, getBookingByIdCon)

export default router