const express = require('express');
const { loginUser, registerUser, getProfile,requestPasswordReset,
  resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getProfile);

// ✅ Forgot password flow
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
