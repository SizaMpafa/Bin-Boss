import { pool } from "../config/config.js"

const registerCleanerDb = async (
  first_name,
  last_name,
  email,
  contact,
  id_number,
  hashedPassword,
  photo // required — no default
) => {
  const [data] = await pool.query(
    `INSERT INTO cleaner (first_name, last_name, email, contact, id_number, password, photo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, email, contact, id_number, hashedPassword, photo]
  )
  return data
}

const loginCleanerDb = async (email) => {
  const [data] = await pool.query(
    `SELECT * FROM cleaner WHERE email = ?`,
    [email]
  )
  return data[0]
}

const getCleanerProfileDb = async (cleaner_id) => {
  const [data] = await pool.query(
    `SELECT cleaner_id, first_name, last_name, email, contact, id_number, photo, bin_id, location_id
     FROM cleaner WHERE cleaner_id = ?`,
    [cleaner_id]
  )
  return data[0]
}

const updateCleanerLocationDb = async (cleaner_id, location_id) => {
  const [data] = await pool.query(
    `UPDATE cleaner SET location_id = ? WHERE cleaner_id = ?`,
    [location_id, cleaner_id]
  )
  return data
}

const updateCleanerBinDb = async (cleaner_id, bin_id) => {
  const [data] = await pool.query(
    `UPDATE cleaner SET bin_id = ? WHERE cleaner_id = ?`,
    [bin_id, cleaner_id]
  )
  return data
}

const getAllCleanersDb = async () => {
  const [data] = await pool.query(
    `SELECT cleaner_id, first_name, last_name, email, contact, photo, location_id
     FROM cleaner`
  )
  return data
}

export {
  registerCleanerDb, loginCleanerDb, getCleanerProfileDb,
  updateCleanerLocationDb, updateCleanerBinDb, getAllCleanersDb
}