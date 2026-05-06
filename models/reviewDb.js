import { pool } from "../config/config.js"

const createReviewDb = async (rating, house_id, cleaner_id) => {
  const [data] = await pool.query(
    `INSERT INTO review (rating, house_id, cleaner_id) VALUES (?, ?, ?)`,
    [rating, house_id, cleaner_id]
  )
  return data
}

const getReviewsByCleanerDb = async (cleaner_id) => {
  const [data] = await pool.query(
    `SELECT r.review_id, r.rating, r.cleaner_id,
            h.house_id, h.first_name AS house_first_name, h.last_name AS house_last_name
     FROM review r
     JOIN house h ON r.house_id = h.house_id
     WHERE r.cleaner_id = ?`,
    [cleaner_id]
  )
  return data
}

const getMyReviewsDb = async (house_id) => {
  const [data] = await pool.query(
    `SELECT r.review_id, r.rating, r.house_id,
            c.cleaner_id, c.first_name AS cleaner_first_name, c.last_name AS cleaner_last_name
     FROM review r
     JOIN cleaner c ON r.cleaner_id = c.cleaner_id
     WHERE r.house_id = ?`,
    [house_id]
  )
  return data
}

const updateReviewDb = async (review_id, rating) => {
  const [data] = await pool.query(
    `UPDATE review SET rating = ? WHERE review_id = ?`,
    [rating, review_id]
  )
  return data
}

const deleteReviewDb = async (review_id) => {
  const [data] = await pool.query(
    `DELETE FROM review WHERE review_id = ?`,
    [review_id]
  )
  return data
}

export { createReviewDb, getReviewsByCleanerDb, getMyReviewsDb, updateReviewDb, deleteReviewDb }