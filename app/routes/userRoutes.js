const express = require('express');
const authController = require('../controllers/authController');
const passResetController = require('../controllers/passResetController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/request-reset-password', passResetController.requestPasswordReset);
router.post('/reset-password', passResetController.resetPassword);


module.exports = router;
