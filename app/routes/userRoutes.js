const express = require('express');
const authController = require('../controllers/authController');
const passResetController = require('../controllers/passResetController');
const fetchController=require('../controllers/fetchController')
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/request-reset-password', passResetController.requestPasswordReset);
router.post('/reset-password', passResetController.resetPassword);


router.get('/fetch-teachers',fetchController.getTeachers)
router.get('/fetch-promotions',fetchController.getPromotions)
router.get('/fetch-table-teachers',fetchController.getTableTeachers)
router.get('/fetch-speciality',fetchController.getSpeciality)
router.get('/fetch-sessions',fetchController.getSessions)

router.get('/fetch-speciality-name',fetchController.getSpecialityName)

module.exports = router;
