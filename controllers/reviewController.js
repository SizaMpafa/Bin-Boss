import {
  createReviewDb, getReviewsByCleanerDb, getMyReviewsDb,
  updateReviewDb, deleteReviewDb
} from "../models/reviewDb.js"

const createReviewCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const { rating, cleaner_id } = req.body
    const data = await createReviewDb(rating, house_id, cleaner_id)
    res.status(201).json({ message: "Review submitted", review_id: data.insertId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getReviewsByCleanerCon = async (req, res) => {
  try {
    const { cleaner_id } = req.params
    const reviews = await getReviewsByCleanerDb(cleaner_id)
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getMyReviewsCon = async (req, res) => {
  try {
    const { id: house_id } = req.user
    const reviews = await getMyReviewsDb(house_id)
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateReviewCon = async (req, res) => {
  try {
    const { id } = req.params
    const { rating } = req.body
    const data = await updateReviewDb(id, rating)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" })
    }
    res.json({ message: "Review updated" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteReviewCon = async (req, res) => {
  try {
    const { id } = req.params
    const data = await deleteReviewDb(id)
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" })
    }
    res.json({ message: "Review deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { createReviewCon, getReviewsByCleanerCon, getMyReviewsCon, updateReviewCon, deleteReviewCon }