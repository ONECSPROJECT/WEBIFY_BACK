const express = require('express');
const authController = require('../controllers/authController');
const passController = require('../controllers/passController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/request-reset-password', passController.requestPasswordReset);
router.post('/reset-password', passController.resetPassword);

// testing protect middleware
router.get('/auth', authMiddleware.protect, authController.testProtected);

module.exports = router;
