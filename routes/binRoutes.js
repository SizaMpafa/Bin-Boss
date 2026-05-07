import express from "express"
import {
  registerBinCon, getMyBinsCon, getBinByIdCon,
  updateBinStatusCon, updateBinLocationCon, deleteBinCon
} from "../controllers/binController.js"
import { verifyToken, requireRole } from "../middleware/authMiddleware.js"

const router = express.Router()

// house only
router.post("/", verifyToken, requireRole("house"), registerBinCon)
router.get("/my-bins", verifyToken, requireRole("house"), getMyBinsCon)
router.delete("/:id", verifyToken, requireRole("house"), deleteBinCon)

// both roles — cleaners and houses need to view + update bins
router.get("/:id", verifyToken, getBinByIdCon)
router.put("/:id/status", verifyToken, updateBinStatusCon)
router.put("/:id/location", verifyToken, updateBinLocationCon)

export default router