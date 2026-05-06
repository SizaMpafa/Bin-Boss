import { pool } from "../config/config.js"

const registerHouseDb = async (
  first_name,
  last_name,
  email,
  contact,
  address_id,
  hashedPassword,
  photo // optional
) => {
  const [data] = await pool.query(
    `INSERT INTO house (first_name, last_name, email, contact, address_id, password, photo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, email, contact, address_id, hashedPassword, photo || null]
  )
  return data
}

const loginHouseDb = async (email) => {
  const [data] = await pool.query(
    `SELECT * FROM house WHERE email = ?`,
    [email]
  )
  return data[0]
}

const getHouseProfileDb = async (house_id) => {
  const [data] = await pool.query(
    `SELECT house_id, first_name, last_name, email, contact, photo, address_id
     FROM house WHERE house_id = ?`,
    [house_id]
  )
  return data[0]
}

const updateHouseDb = async (house_id, first_name, last_name, contact, photo) => {
  const [data] = await pool.query(
    `UPDATE house SET first_name = ?, last_name = ?, contact = ?, photo = ?
     WHERE house_id = ?`,
    [first_name, last_name, contact, photo, house_id]
  )
  return data
}

export { registerHouseDb, loginHouseDb, getHouseProfileDb, updateHouseDb }