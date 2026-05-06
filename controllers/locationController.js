import {
  createLocationDb, getAllLocationsDb, getLocationByIdDb,
  updateLocationDb, deleteLocationDb
} from "../models/locationDb.js"

const createLocationCon = async (req, res) => {
  try {
    const { longitude, latitude } = req.body
    const data = await createLocationDb(longitude, latitude)
    res.status(201).json({ message: "Location created", location_id: data.insertId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getAllLocationsCon = async (req, res) => {
  try {
    const locations = await getAllLocationsDb()
    res.json(locations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getLocationByIdCon = async (req, res) => {
  try {
    const { id } = req.params
    const location = await getLocationByIdDb(id)
    if (!location) {
      return res.status(404).json({ message: "Location not found" })
    }
    res.json(location)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateLocationCon = async (req, res) => {
  try {
    const { id } = req.params
    const { longitude, latitude } = req.body
    const data = await updateLocationDb(id, longitude, latitude)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Location not found" })
    }
    res.json({ message: "Location updated" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteLocationCon = async (req, res) => {
  try {
    const { id } = req.params
    const data = await deleteLocationDb(id)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Location not found" })
    }
    res.json({ message: "Location deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { createLocationCon, getAllLocationsCon, getLocationByIdCon, updateLocationCon, deleteLocationCon }