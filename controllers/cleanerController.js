import {
  registerCleanerDb, loginCleanerDb, getCleanerProfileDb,
  updateCleanerLocationDb, updateCleanerBinDb, getAllCleanersDb
} from "../models/cleanerDb.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerCleanerCon = async (req, res) => {
  try {
    const { first_name, last_name, email, contact, id_number, password, photo } = req.body

    // photo is mandatory for cleaners
    if (!photo) {
      return res.status(400).json({ message: "A profile photo is required for cleaners" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await registerCleanerDb(
      first_name, last_name, email, contact,
      id_number, hashedPassword, photo
    )
    res.status(201).json({ message: "Cleaner registered successfully" })
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" })
    }
    res.status(500).json({ error: error.message })
  }
}

const loginCleanerCon = async (req, res) => {
  try {
    const { email, password } = req.body
    const cleaner = await loginCleanerDb(email)
    if (!cleaner) {
      return res.status(404).json({ message: "Account not found" })
    }
    const match = await bcrypt.compare(password, cleaner.password)
    if (!match) {
      return res.status(401).json({ message: "Invalid password" })
    }
    const token = jwt.sign(
      { id: cleaner.cleaner_id, role: "cleaner" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    )
    res.json({
      token,
      user: {
        cleaner_id: cleaner.cleaner_id,
        first_name: cleaner.first_name,
        last_name: cleaner.last_name,
        email: cleaner.email,
        role: "cleaner"
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getCleanerProfileCon = async (req, res) => {
  try {
    const { id } = req.user
    const cleaner = await getCleanerProfileDb(id)
    if (!cleaner) {
      return res.status(404).json({ message: "Profile not found" })
    }
    res.json(cleaner)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getAllCleanersCon = async (req, res) => {
  try {
    const cleaners = await getAllCleanersDb()
    res.json(cleaners)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateCleanerLocationCon = async (req, res) => {
  try {
    const { id } = req.user
    const { location_id } = req.body
    const data = await updateCleanerLocationDb(id, location_id)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Cleaner not found" })
    }
    res.json({ message: "Location updated" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateCleanerBinCon = async (req, res) => {
  try {
    const { id } = req.user
    const { bin_id } = req.body
    const data = await updateCleanerBinDb(id, bin_id)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Cleaner not found" })
    }
    res.json({ message: "Bin assigned" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export {
  registerCleanerCon, loginCleanerCon, getCleanerProfileCon,
  getAllCleanersCon, updateCleanerLocationCon, updateCleanerBinCon
}