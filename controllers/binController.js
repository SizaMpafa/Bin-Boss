import {
  generateBinCode, registerBinDb, getBinsByHouseDb,
  getBinByIdDb, updateBinStatusDb, updateBinLocationDb, deleteBinDb
} from "../models/binDb.js"
import { getHouseProfileDb } from "../models/houseDb.js"
import { getAddressByIdDb } from "../models/addressDb.js"

const registerBinCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const { photo } = req.body

    // fetch house + address to build the bin code
    const house = await getHouseProfileDb(house_id)
    if (!house) {
      return res.status(404).json({ message: "House profile not found" })
    }
    if (!house.address_id) {
      return res.status(400).json({ message: "Please add your address before registering a bin" })
    }

    const address = await getAddressByIdDb(house.address_id)
    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    const bin_code = await generateBinCode(
      house.first_name,
      house.last_name,
      address.street_name,
      address.house_number
    )

    const data = await registerBinDb(bin_code, house_id, photo)
    res.status(201).json({
      message: "Bin registered successfully",
      bin_id: data.insertId,
      bin_code
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getMyBinsCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const bins = await getBinsByHouseDb(house_id)
    res.json(bins)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getBinByIdCon = async (req, res) => {
  try {
    const { id } = req.params
    const bin = await getBinByIdDb(id)
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" })
    }
    res.json(bin)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// cleaner updates status: collected → cleaned → returned
// house updates status: received (final step)
const CLEANER_ALLOWED = ['collected', 'cleaned', 'returned']
const HOUSE_ALLOWED   = ['received']

const updateBinStatusCon = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const { role } = req.user

    const allowed = role === 'cleaner' ? CLEANER_ALLOWED : HOUSE_ALLOWED
    if (!allowed.includes(status)) {
      return res.status(403).json({
        message: `Your role cannot set bin status to '${status}'`
      })
    }

    const data = await updateBinStatusDb(id, status)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Bin not found" })
    }
    res.json({ message: `Bin status updated to '${status}'` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateBinLocationCon = async (req, res) => {
  try {
    const { id } = req.params
    const { location_id } = req.body
    const data = await updateBinLocationDb(id, location_id)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Bin not found" })
    }
    res.json({ message: "Bin location updated" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteBinCon = async (req, res) => {
  try {
    const { id } = req.params
    const data = await deleteBinDb(id)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Bin not found" })
    }
    res.json({ message: "Bin deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export {
  registerBinCon, getMyBinsCon, getBinByIdCon,
  updateBinStatusCon, updateBinLocationCon, deleteBinCon
}