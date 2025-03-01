const express = require('express');
const authController = require('../WEBIFY_BACK/app/controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/updatePassword',authController.protect ,  authController.updatePassword);



module.exports = router;
