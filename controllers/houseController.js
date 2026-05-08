import { registerHouseDb, loginHouseDb, getHouseProfileDb, updateHouseDb } from "../models/houseDb.js"
import { createAddressDb } from "../models/addressDb.js" // add this import
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerHouseCon = async (req, res) => {
  try {
    const {
      first_name, last_name, email, contact, password, photo,
      house_number, street_name, place, postal_code  // address fields come in here too
    } = req.body

    // validate all required fields
    if (!house_number || !street_name || !place || !postal_code) {
      return res.status(400).json({ message: "Address is required" })
    }

    // create address first — backend handles this, frontend doesn't know
    const addressData = await createAddressDb(house_number, street_name, place, postal_code)
    const address_id = addressData.insertId

    // then create house with the new address_id
    const hashedPassword = await bcrypt.hash(password, 10)
    await registerHouseDb(
      first_name, last_name, email, contact,
      address_id, hashedPassword, photo
    )

    res.status(201).json({ message: "House owner registered successfully" })
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" })
    }
    res.status(500).json({ error: error.message })
  }
}

// rest of the controllers stay exactly the same
const loginHouseCon = async (req, res) => {
  try {
    const { email, password } = req.body
    const house = await loginHouseDb(email)
    if (!house) {
      return res.status(404).json({ message: "Account not found" })
    }
    const match = await bcrypt.compare(password, house.password)
    if (!match) {
      return res.status(401).json({ message: "Invalid password" })
    }
    const token = jwt.sign(
      { id: house.house_id, role: "house" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    )
    res.json({
      token,
      user: {
        house_id: house.house_id,
        first_name: house.first_name,
        last_name: house.last_name,
        email: house.email,
        role: "house"
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getHouseProfileCon = async (req, res) => {
  try {
    const { id } = req.user
    const house = await getHouseProfileDb(id)
    if (!house) {
      return res.status(404).json({ message: "Profile not found" })
    }
    res.json(house)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateHouseProfileCon = async (req, res) => {
  try {
    const { id } = req.user
    const { first_name, last_name, contact, photo } = req.body
    const data = await updateHouseDb(id, first_name, last_name, contact, photo)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Profile not found" })
    }
    res.json({ message: "Profile updated" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { registerHouseCon, loginHouseCon, getHouseProfileCon, updateHouseProfileCon }