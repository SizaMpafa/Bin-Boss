import express from "express"
import cors from "cors"
import 'dotenv/config'
import houseRoutes from "./routes/houseRoutes.js"
import cleanerRoutes from "./routes/cleanerRoutes.js"
import addressRoutes from "./routes/addressRoutes.js"
import locationRoutes from "./routes/locationRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import binRoutes from "./routes/binRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 4321

app.use("/house", houseRoutes)
app.use("/cleaner", cleanerRoutes)
app.use("/address", addressRoutes)
app.use("/location", locationRoutes)
app.use("/review", reviewRoutes)
app.use("/bin", binRoutes)
app.use("/booking", bookingRoutes)

app.get("/test", async (req, res) => {
  try {
    const { pool } = await import("./config/config.js")
    const [rows] = await pool.query("SELECT 1")
    res.json({ status: "ok", db: "connected" })
  } catch (err) {
    res.json({ status: "error", message: err.message })
  }
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})