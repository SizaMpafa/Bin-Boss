import { pool } from "../config/config.js"

const createLocationDb = async (longitude, latitude) => {
  const [data] = await pool.query(
    `INSERT INTO location (longitude, latitude) VALUES (?, ?)`,
    [longitude, latitude]
  )
  return data
}

const getAllLocationsDb = async () => {
  const [data] = await pool.query(`SELECT * FROM location`)
  return data
}

const getLocationByIdDb = async (location_id) => {
  const [data] = await pool.query(
    `SELECT * FROM location WHERE location_id = ?`,
    [location_id]
  )
  return data[0]
}

const updateLocationDb = async (location_id, longitude, latitude) => {
  const [data] = await pool.query(
    `UPDATE location SET longitude = ?, latitude = ? WHERE location_id = ?`,
    [longitude, latitude, location_id]
  )
  return data
}

const deleteLocationDb = async (location_id) => {
  const [data] = await pool.query(
    `DELETE FROM location WHERE location_id = ?`,
    [location_id]
  )
  return data
}

export { createLocationDb, getAllLocationsDb, getLocationByIdDb, updateLocationDb, deleteLocationDb }