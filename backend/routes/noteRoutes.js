const express = require("express");
const router = express.Router();
const { createNote, getUserNotes, updateNote, deleteNote } = require("../controllers/noteController");

const { protect } = require("../middleware/authMiddleware");

// POST -> /api/notes/create-note (Protected)
router.post("/create-note", protect, createNote);

// GET -> /api/notes (Protected)
router.get("/", protect, getUserNotes);

router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);


module.exports = router;
