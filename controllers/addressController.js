import {
  createAddressDb, getAllAddressesDb, getAddressByIdDb,
  updateAddressDb, deleteAddressDb
} from "../models/addressDb.js"

const createAddressCon = async (req, res) => {
  try {
    const { house_number, street_name, place, postal_code } = req.body
    const data = await createAddressDb(house_number, street_name, place, postal_code)
    res.status(201).json({ message: "Address created", address_id: data.insertId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getAllAddressesCon = async (req, res) => {
  try {
    const addresses = await getAllAddressesDb()
    res.json(addresses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getAddressByIdCon = async (req, res) => {
  try {
    const { id } = req.params
    const address = await getAddressByIdDb(id)
    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }
    res.json(address)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateAddressCon = async (req, res) => {
  try {
    const { id } = req.params
    const { house_number, street_name, place, postal_code } = req.body
    const data = await updateAddressDb(id, house_number, street_name, place, postal_code)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Address not found" })
    }
    res.json({ message: "Address updated" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteAddressCon = async (req, res) => {
  try {
    const { id } = req.params
    const data = await deleteAddressDb(id)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Address not found" })
    }
    res.json({ message: "Address deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { createAddressCon, getAllAddressesCon, getAddressByIdCon, updateAddressCon, deleteAddressCon }