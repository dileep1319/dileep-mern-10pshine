const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel');
const logger = require('../utils/logger'); // ✅ import Pino logger

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  logger.info({ email }, "Login attempt received");

  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    logger.info({ userId: user.id, email }, "User logged in successfully");
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    logger.warn({ email }, "Invalid email or password");
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  logger.info({ email }, "Register attempt received");

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    logger.warn({ email }, "Registration failed: user already exists");
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    logger.info({ userId: user.id, email }, "User registered successfully");
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    logger.error({ email }, "User registration failed: invalid data");
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  logger.debug({ userId: req.user.id }, "Fetching user profile");
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });

  if (user) {
    logger.info({ userId: user.id }, "Profile fetched successfully");
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    logger.error({ userId: req.user.id }, "Profile not found");
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Send password reset code
// @route   POST /api/users/forgot-password
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  logger.info({ email }, "Password reset request received");

  const user = await User.findOne({ where: { email } });

  if (!user) {
    logger.warn({ email }, "Password reset failed: no account found");
    res.status(404);
    throw new Error('No account found with that email.');
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = resetCode;
  user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Email setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Notes App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Code',
    text: `Your password reset code is: ${resetCode}. It will expire in 10 minutes.`,
  });

  logger.info({ email }, "Password reset code sent successfully");
  res.json({ message: 'Reset code sent to your email.' });
});

// @desc    Reset user password using code
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  logger.info({ email }, "Password reset attempt");

  const user = await User.findOne({ where: { email } });

  if (!user || user.resetCode !== code) {
    logger.warn({ email, code }, "Invalid reset code or email");
    res.status(400);
    throw new Error('Invalid code or email.');
  }

  if (Date.now() > user.resetCodeExpiry) {
    logger.warn({ email }, "Reset code expired");
    res.status(400);
    throw new Error('Reset code expired. Please request again.');
  }

  user.password = newPassword;
  user.resetCode = null;
  user.resetCodeExpiry = null;

  await user.save();

  logger.info({ email }, "Password reset successful");
  res.json({ message: 'Password reset successful. You can now log in.' });
});

module.exports = {
  loginUser,
  registerUser,
  getProfile,
  requestPasswordReset,
  resetPassword,
};
