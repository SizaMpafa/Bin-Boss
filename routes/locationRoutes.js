import express from "express"
import {
  createLocationCon, getAllLocationsCon, getLocationByIdCon,
  updateLocationCon, deleteLocationCon
} from "../controllers/locationController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

// public — anyone can view locations
router.get("/", getAllLocationsCon)
router.get("/:id", getLocationByIdCon)

// protected — must be logged in (any role)
router.post("/", verifyToken, createLocationCon)
router.put("/:id", verifyToken, updateLocationCon)
router.delete("/:id", verifyToken, deleteLocationCon)

export default router