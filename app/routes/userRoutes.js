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
router.get('/fetch-salles',fetchController.getSalles)
router.get('/fetch-promotions',fetchController.getPromotions)
router.get('/fetch-sections',fetchController.getSections)
router.get('/fetch-groups',fetchController.getGroups)
router.get('/fetch-table-teachers',fetchController.getTableTeachers)
router.get("/fetch-section-name", fetchController.getSectionName);
router.get("/fetch-group-name", fetchController.getGroupName);
module.exports = router;
