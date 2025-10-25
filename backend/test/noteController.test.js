const { expect } = require("chai");
const request = require("supertest");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const app = require("../app");
const Note = require("../models/Note");
const User = require("../models/userModel");

describe("Notes Controller", () => {
  let sandbox;
  const fakeUser = { id: 1, name: "Dilu", email: "test@example.com" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(jwt, "verify").returns({ id: fakeUser.id });
    sandbox.stub(User, "findByPk").resolves(fakeUser);
  });

  afterEach(() => {
    sandbox.restore();
  });

  // 🧪 CREATE NOTE
  describe("POST /api/notes/create-note", () => {
    it("should create a note successfully", async () => {
      const fakeNote = { id: 1, title: "Test Note", content: "This is a note" };

      sandbox.stub(Note, "create").resolves(fakeNote);

      const res = await request(app)
        .post("/api/notes/create-note")
        .set("Authorization", "Bearer fake-token")
        .send({ title: "Test Note", content: "This is a note" });

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("Note created successfully");
      expect(res.body.note.title).to.equal(fakeNote.title);
    });

    it("should return 400 if fields are missing", async () => {
      const res = await request(app)
        .post("/api/notes/create-note")
        .set("Authorization", "Bearer fake-token")
        .send({ title: "" });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("All fields are required.");
    });
  });

  // 🧪 GET ALL NOTES
  describe("GET /api/notes", () => {
    it("should return all notes for user", async () => {
      const fakeNotes = [
        { id: 1, title: "Note A", content: "Content A" },
        { id: 2, title: "Note B", content: "Content B" },
      ];

      sandbox.stub(Note, "findAll").resolves(fakeNotes);

      const res = await request(app)
        .get("/api/notes")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.equal(2);
    });

    it("should handle search query", async () => {
      const fakeNotes = [{ id: 1, title: "Meeting notes", content: "Important" }];
      sandbox.stub(Note, "findAll").resolves(fakeNotes);

      const res = await request(app)
        .get("/api/notes?search=meeting")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body[0].title).to.equal("Meeting notes");
    });
  });

  // 🧪 SEARCH NOTES
  describe("GET /api/notes/search", () => {
    it("should return matching notes for query", async () => {
      const fakeNotes = [{ id: 1, title: "Project Plan", content: "Details" }];
      sandbox.stub(Note, "findAll").resolves(fakeNotes);

      const res = await request(app)
        .get("/api/notes/search?query=project")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body[0].title).to.equal("Project Plan");
    });

    it("should return empty array for empty query", async () => {
      const res = await request(app)
        .get("/api/notes/search?query=")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });
  });

  // 🧪 UPDATE NOTE
  describe("PUT /api/notes/:id", () => {
    it("should update note successfully", async () => {
      const fakeNote = {
        id: 1,
        userId: fakeUser.id,
        title: "Old Title",
        content: "Old Content",
        save: sinon.stub().resolves(),
      };

      sandbox.stub(Note, "findOne").resolves(fakeNote);

      const res = await request(app)
        .put("/api/notes/1")
        .set("Authorization", "Bearer fake-token")
        .send({ title: "New Title", content: "New Content" });

      expect(res.status).to.equal(200);
      expect(fakeNote.save.calledOnce).to.be.true;
    });

    it("should return 404 if note not found", async () => {
      sandbox.stub(Note, "findOne").resolves(null);

      const res = await request(app)
        .put("/api/notes/999")
        .set("Authorization", "Bearer fake-token")
        .send({ title: "Doesn't matter" });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Note not found or not authorized");
    });
  });

  // 🧪 DELETE NOTE
  describe("DELETE /api/notes/:id", () => {
    it("should delete note successfully", async () => {
      const fakeNote = { id: 1, destroy: sinon.stub().resolves() };
      sandbox.stub(Note, "findOne").resolves(fakeNote);

      const res = await request(app)
        .delete("/api/notes/1")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Note deleted successfully");
    });

    it("should return 404 if note not found", async () => {
      sandbox.stub(Note, "findOne").resolves(null);

      const res = await request(app)
        .delete("/api/notes/999")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Note not found or not authorized");
    });
  });
});