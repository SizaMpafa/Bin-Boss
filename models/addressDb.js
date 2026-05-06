import { pool } from "../config/config.js"

const createAddressDb = async (house_number, street_name, place, postal_code) => {
  const [data] = await pool.query(
    `INSERT INTO address (house_number, street_name, place, postal_code)
     VALUES (?, ?, ?, ?)`,
    [house_number, street_name, place, postal_code]
  )
  return data
}

const getAllAddressesDb = async () => {
  const [data] = await pool.query(`SELECT * FROM address`)
  return data
}

const getAddressByIdDb = async (address_id) => {
  const [data] = await pool.query(
    `SELECT * FROM address WHERE address_id = ?`,
    [address_id]
  )
  return data[0]
}

const updateAddressDb = async (address_id, house_number, street_name, place, postal_code) => {
  const [data] = await pool.query(
    `UPDATE address SET house_number = ?, street_name = ?, place = ?, postal_code = ?
     WHERE address_id = ?`,
    [house_number, street_name, place, postal_code, address_id]
  )
  return data
}

const deleteAddressDb = async (address_id) => {
  const [data] = await pool.query(
    `DELETE FROM address WHERE address_id = ?`,
    [address_id]
  )
  return data
}

export { createAddressDb, getAllAddressesDb, getAddressByIdDb, updateAddressDb, deleteAddressDb }