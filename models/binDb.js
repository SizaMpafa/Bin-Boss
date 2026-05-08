import { pool } from "../config/config.js"

// generates SMJ5227, SMJ5227_2, SMJ5227_3 etc
const generateBinCode = async (first_name, last_name, street_name, house_number) => {
  const base =
    first_name[0].toUpperCase() +
    last_name[0].toUpperCase() +
    street_name[0].toUpperCase() +
    house_number

  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM bin WHERE bin_code = ? OR bin_code LIKE ?`,
    [base, `${base}_%`]
  )
  const count = rows[0].count
  return count === 0 ? base : `${base}_${count + 1}`
}

const registerBinDb = async (bin_code, house_id, photo, bin_type) => {
  const [data] = await pool.query(
    `INSERT INTO bin (bin_code, house_id, photo, status, bin_type)
     VALUES (?, ?, ?, 'not_collected', ?)`,
    [bin_code, house_id, photo || null, bin_type]
  )
  return data
}

const getBinsByHouseDb = async (house_id) => {
  const [data] = await pool.query(
    `SELECT * FROM bin WHERE house_id = ?`,
    [house_id]
  )
  return data
}

const getBinByIdDb = async (bin_id) => {
  const [data] = await pool.query(
    `SELECT * FROM bin WHERE bin_id = ?`,
    [bin_id]
  )
  return data[0]
}

const updateBinStatusDb = async (bin_id, status) => {
  const [data] = await pool.query(
    `UPDATE bin SET status = ? WHERE bin_id = ?`,
    [status, bin_id]
  )
  return data
}

const updateBinLocationDb = async (bin_id, location_id) => {
  const [data] = await pool.query(
    `UPDATE bin SET location_id = ? WHERE bin_id = ?`,
    [location_id, bin_id]
  )
  return data
}

const deleteBinDb = async (bin_id) => {
  const [data] = await pool.query(
    `DELETE FROM bin WHERE bin_id = ?`,
    [bin_id]
  )
  return data
}

export {
  generateBinCode, registerBinDb, getBinsByHouseDb,
  getBinByIdDb, updateBinStatusDb, updateBinLocationDb, deleteBinDb
}