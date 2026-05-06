import express from "express"
import { registerHouseCon, loginHouseCon, getHouseProfileCon, updateHouseProfileCon } from "../controllers/houseController.js"
import { verifyToken, requireRole } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", registerHouseCon)
router.post("/login", loginHouseCon)
router.get("/profile", verifyToken, requireRole("house"), getHouseProfileCon)
router.put("/profile", verifyToken, requireRole("house"), updateHouseProfileCon)

export default router