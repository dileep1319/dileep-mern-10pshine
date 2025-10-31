const { expect } = require("chai");
const request = require("supertest");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const app = require("../app");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const generateToken = require("../utils/generateToken");

describe("User Controller", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  // 🧪 REGISTER USER
  describe("POST /api/users", () => {
    it("should register a new user successfully", async () => {
      const fakeUser = { id: 1, name: "Dilu", email: "test@example.com" };

      sandbox.stub(User, "findOne").resolves(null);
      sandbox.stub(User, "create").resolves(fakeUser);

      // ✅ FIX: stub the function directly
      sandbox.stub(generateToken, "call").callsFake(() => "fake-token");

      // Even simpler: directly stub the require cache
      require.cache[require.resolve("../utils/generateToken")].exports = () => "fake-token";

      const res = await request(app)
        .post("/api/users")
        .send({ name: "Dilu", email: "test@example.com", password: "123456" });

      expect(res.status).to.equal(201);
      expect(res.body.email).to.equal(fakeUser.email);
    });

    it("should not register if user already exists", async () => {
      sandbox.stub(User, "findOne").resolves({ id: 1 });

      const res = await request(app)
        .post("/api/users")
        .send({ name: "Existing", email: "test@example.com", password: "123456" });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("User already exists");
    });
  });

  // 🧪 LOGIN USER
  describe("POST /api/users/login", () => {
    it("should login with correct credentials", async () => {
      const fakeUser = {
        id: 1,
        name: "Dilu",
        email: "test@example.com",
        matchPassword: sinon.stub().resolves(true),
      };

      sandbox.stub(User, "findOne").resolves(fakeUser);
      sandbox.stub(jwt, "sign").returns("fake-jwt");

      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "test@example.com", password: "123456" });

      expect(res.status).to.equal(200);
      expect(res.body.token).to.equal("fake-jwt");
    });

    it("should reject invalid credentials", async () => {
      sandbox.stub(User, "findOne").resolves(null);

      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "wrong@example.com", password: "wrong" });

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal("Invalid email or password");
    });
  });

  // 🧪 GET PROFILE
  describe("GET /api/users/profile", () => {
    it("should return user profile if authorized", async () => {
      const fakeUser = { id: 1, name: "Dilu", email: "test@example.com" };
      sandbox.stub(User, "findByPk").resolves(fakeUser);
      sandbox.stub(jwt, "verify").returns({ id: 1 });

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer fake-jwt");

      expect(res.status).to.equal(200);
      expect(res.body.email).to.equal("test@example.com");
    });
  });

  // 🧪 FORGOT PASSWORD
  describe("POST /api/users/forgot-password", () => {
    it("should send reset code if user exists", async () => {
      const fakeUser = {
        id: 1,
        email: "test@example.com",
        save: sinon.stub().resolves(),
      };

      sandbox.stub(User, "findOne").resolves(fakeUser);
      sandbox.stub(nodemailer, "createTransport").returns({
        sendMail: sinon.stub().resolves(true),
      });

      const res = await request(app)
        .post("/api/users/forgot-password")
        .send({ email: "test@example.com" });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Reset code sent to your email.");
    });

    it("should return 404 for invalid email", async () => {
      sandbox.stub(User, "findOne").resolves(null);

      const res = await request(app)
        .post("/api/users/forgot-password")
        .send({ email: "noone@example.com" });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("No account found with that email.");
    });
  });

  // 🧪 RESET PASSWORD
  describe("POST /api/users/reset-password", () => {
    it("should reset password successfully", async () => {
      const fakeUser = {
        email: "test@example.com",
        resetCode: "123456",
        resetCodeExpiry: Date.now() + 10000,
        save: sinon.stub().resolves(),
      };

      sandbox.stub(User, "findOne").resolves(fakeUser);

      const res = await request(app)
        .post("/api/users/reset-password")
        .send({
          email: "test@example.com",
          code: "123456",
          newPassword: "newPass",
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(
        "Password reset successful. You can now log in."
      );
    });

    it("should reject invalid code", async () => {
      const fakeUser = {
        email: "test@example.com",
        resetCode: "654321",
        resetCodeExpiry: Date.now() + 10000,
      };

      sandbox.stub(User, "findOne").resolves(fakeUser);

      const res = await request(app)
        .post("/api/users/reset-password")
        .send({
          email: "test@example.com",
          code: "123456",
          newPassword: "newPass",
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid code or email.");
    });
  });
});