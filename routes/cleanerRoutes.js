import express from "express"
import {
  registerCleanerCon, loginCleanerCon, getCleanerProfileCon,
  getAllCleanersCon, updateCleanerLocationCon, updateCleanerBinCon
} from "../controllers/cleanerController.js"
import { verifyToken, requireRole } from "../middleware/authMiddleware.js"

const router = express.Router()

// public
router.post("/register", registerCleanerCon)
router.post("/login", loginCleanerCon)
router.get("/", getAllCleanersCon) // house owners browse available cleaners

// protected — cleaner only
router.get("/profile", verifyToken, requireRole("cleaner"), getCleanerProfileCon)
router.put("/location", verifyToken, requireRole("cleaner"), updateCleanerLocationCon)
router.put("/bin", verifyToken, requireRole("cleaner"), updateCleanerBinCon)

export default router