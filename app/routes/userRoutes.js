const express = require('express');
const authController = require('../controllers/authController');
const passResetController = require('../controllers/passResetController');
const userController = require("../controllers/userController")
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/request-reset-password', passResetController.requestPasswordReset);
router.post('/reset-password', passResetController.resetPassword);

// testing protect middleware
router.get('/auth', authController.protect, authController.testProtected);

// Auth routes for user self-management
router.get("/me", userController.getMe); 
router.patch('/updateMe', userController.updateMe);
router.delete('/me', userController.deleteMe);

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


module.exports = router;
