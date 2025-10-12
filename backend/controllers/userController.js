const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Send password reset code
// @route   POST /api/users/forgot-password
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(404);
    throw new Error('No account found with that email.');
  }

  // Generate 6-digit code
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

  res.json({ message: 'Reset code sent to your email.' });
});

// @desc    Reset user password using code
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || user.resetCode !== code) {
    res.status(400);
    throw new Error('Invalid code or email.');
  }

  if (Date.now() > user.resetCodeExpiry) {
    res.status(400);
    throw new Error('Reset code expired. Please request again.');
  }

  // Assign plain password, let hook hash it
  user.password = newPassword;

  // Clear reset fields
  user.resetCode = null;
  user.resetCodeExpiry = null;

  await user.save();

  res.json({ message: 'Password reset successful. You can now log in.' });
});


module.exports = {
  loginUser,
  registerUser,
  getProfile,
  requestPasswordReset,
  resetPassword,
};
