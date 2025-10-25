const express = require("express");
const router = express.Router();
const {
  createNote,
  getUserNotes,
  updateNote,
  deleteNote,
  searchNotes,
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

// 🟢 Create
router.post("/create-note", protect, createNote);

// 🟢 Search (keep before /:id to avoid conflict)
router.get("/search", protect, searchNotes);

// 🟢 Get all
router.get("/", protect, getUserNotes);

// 🟢 Update / Delete
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;

