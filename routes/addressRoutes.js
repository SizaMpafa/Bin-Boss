import express from "express"
import {
  createAddressCon, getAllAddressesCon, getAddressByIdCon,
  updateAddressCon, deleteAddressCon
} from "../controllers/addressController.js"
import { verifyToken, requireRole } from "../middleware/authMiddleware.js"

const router = express.Router()

// public
router.get("/", getAllAddressesCon)
router.get("/:id", getAddressByIdCon)

// protected — house only
router.post("/", verifyToken, requireRole("house"), createAddressCon)
router.put("/:id", verifyToken, requireRole("house"), updateAddressCon)
router.delete("/:id", verifyToken, requireRole("house"), deleteAddressCon)

export default router