const asyncHandler = require('express-async-handler');
const Note = require("../models/Note");

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const note = await Note.create({
      userId: req.user.id,
      title,
      content,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all notes for the logged-in user
exports.getUserNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({ where: { userId: req.user.id } });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};


exports.updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await Note.findOne({ where: { id, userId: req.user.id } });

  if (!note) {
    res.status(404);
    throw new Error("Note not found or not authorized");
  }

  note.title = title || note.title;
  note.content = content || note.content;

  await note.save();
  res.json(note);
});

// Delete note 
exports.deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findOne({ where: { id, userId: req.user.id } });

  if (!note) {
    res.status(404);
    throw new Error("Note not found or not authorized");
  }

  await note.destroy();
  res.json({ message: "Note deleted successfully" });
});


