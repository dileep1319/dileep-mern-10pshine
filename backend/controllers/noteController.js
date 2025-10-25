const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Note = require("../models/Note");

// 🟢 Create Note
exports.createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const note = await Note.create({
    userId: req.user.id,
    title,
    content,
  });

  res.status(201).json({ message: "Note created successfully", note });
});

// 🟢 Get All Notes (with optional ?search= query)
exports.getUserNotes = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const where = { userId: req.user.id };

  if (search && search.trim()) {
    // Split search query into words
    const terms = search.trim().split(/\s+/);

    // Match notes that contain all terms (in title or content)
    where[Op.and] = terms.map((term) => ({
      [Op.or]: [
        { title: { [Op.iLike]: `%${term}%` } },
        { content: { [Op.iLike]: `%${term}%` } },
      ],
    }));
  }

  const notes = await Note.findAll({
    where,
    order: [["updatedAt", "DESC"]],
  });

  res.status(200).json(notes);
});

// 🟢 Dedicated Search Endpoint (same smart logic)
exports.searchNotes = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim();
  if (!query) return res.json([]);

  // Split into individual terms
  const terms = query.split(/\s+/);

  // Match notes containing *any* of the words in title or content
  const notes = await Note.findAll({
    where: {
      userId: req.user.id,
      [Op.and]: [
        {
          [Op.or]: [
            { title: { [Op.iLike]: `%${query}%` } },
            { content: { [Op.iLike]: `%${query}%` } },
          ],
        },
        {
          [Op.or]: terms.map((term) => ({
            [Op.or]: [
              { title: { [Op.iLike]: `%${term}%` } },
              { content: { [Op.iLike]: `%${term}%` } },
            ],
          })),
        },
      ],
    },
    order: [["updatedAt", "DESC"]],
  });

  res.status(200).json(notes);
});

// 🟢 Update Note
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

// 🟢 Delete Note
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
