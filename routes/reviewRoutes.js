import express from "express"
import {
  createReviewCon, getReviewsByCleanerCon, getMyReviewsCon,
  updateReviewCon, deleteReviewCon
} from "../controllers/reviewController.js"
import { verifyToken, requireRole } from "../middleware/authMiddleware.js"

const router = express.Router()

// public — anyone can see a cleaner's reviews
router.get("/cleaner/:cleaner_id", getReviewsByCleanerCon)

// protected — house only
router.get("/my-reviews", verifyToken, requireRole("house"), getMyReviewsCon)
router.post("/", verifyToken, requireRole("house"), createReviewCon)
router.put("/:id", verifyToken, requireRole("house"), updateReviewCon)
router.delete("/:id", verifyToken, requireRole("house"), deleteReviewCon)

export default router