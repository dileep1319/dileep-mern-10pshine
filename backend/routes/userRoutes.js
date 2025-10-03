const express = require('express');
const { loginUser, registerUser, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getProfile);

module.exports = router;
