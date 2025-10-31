const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Note = require("../models/Note");
const logger = require("../utils/logger"); // ✅ import Pino logger

// 🟢 Create Note
exports.createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    logger.warn("Create note failed: Missing title or content");
    return res.status(400).json({ message: "All fields are required." });
  }

  const note = await Note.create({
    userId: req.user.id,
    title,
    content,
  });

  logger.info({ userId: req.user.id, noteId: note.id }, "Note created successfully");
  res.status(201).json({ message: "Note created successfully", note });
});

// 🟢 Get All Notes (with optional ?search= query)
exports.getUserNotes = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const where = { userId: req.user.id };

  if (search && search.trim()) {
    const terms = search.trim().split(/\s+/);
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

  logger.info({ userId: req.user.id, notesCount: notes.length }, "Fetched user notes");
  res.status(200).json(notes);
});

// 🟢 Dedicated Search Endpoint
exports.searchNotes = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim();
  if (!query) {
    logger.warn("Search attempted with empty query");
    return res.json([]);
  }

  const terms = query.split(/\s+/);

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

  logger.info({ userId: req.user.id, query, resultCount: notes.length }, "Search completed");
  res.status(200).json(notes);
});

// 🟢 Update Note
exports.updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await Note.findOne({ where: { id, userId: req.user.id } });
  if (!note) {
    logger.error({ noteId: id, userId: req.user.id }, "Note not found or unauthorized update attempt");
    res.status(404);
    throw new Error("Note not found or not authorized");
  }

  note.title = title || note.title;
  note.content = content || note.content;
  await note.save();

  logger.info({ noteId: id, userId: req.user.id }, "Note updated successfully");
  res.json(note);
});

// 🟢 Delete Note
exports.deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findOne({ where: { id, userId: req.user.id } });
  if (!note) {
    logger.error({ noteId: id, userId: req.user.id }, "Note not found or unauthorized delete attempt");
    res.status(404);
    throw new Error("Note not found or not authorized");
  }

  await note.destroy();
  logger.info({ noteId: id, userId: req.user.id }, "Note deleted successfully");
  res.json({ message: "Note deleted successfully" });
});
