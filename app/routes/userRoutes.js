const express = require('express');
const authController = require('../controllers/authController');
const passResetController = require('../controllers/passResetController');
const fetchController=require('../controllers/fetchController')
const saveController=require('../controllers/saveContoller')
const deleteController=require('../controllers/deleteController')
const updateController=require('../controllers/updateController')
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/request-reset-password', passResetController.requestPasswordReset);
router.post('/reset-password', passResetController.resetPassword);
router.post('/save-holiday',saveController.saveHoliday)
router.post('/save-semesters',saveController.saveSemesters)
router.post('/save-schedule',saveController.saveSched)
router.post('/save-periods',saveController.savePeriods)
router.post('/save-vacation',saveController.saveVacations)


router.get('/fetch-teachers',fetchController.getTeachers)
router.get('/fetch-promotions',fetchController.getPromotions)
router.get('/fetch-table-teachers',fetchController.getTableTeachers)
router.get('/fetch-speciality',fetchController.getSpeciality)
router.get('/fetch-sessions',fetchController.getSessions)
router.get('/fetch-speciality-name',fetchController.getSpecialityName)
router.get('/fetch-scheds',fetchController.getSched)
router.get('/fetch-admin-name',fetchController.fetchAdminName)
router.get('/fetch-admin-email',fetchController.fetchAdminEmail)
router.get('/fetch-holiday',fetchController.getHolidays)
router.get('/get-selective-teachers',fetchController.getSelectiveTeachers)
router.get('/fetch-extra-session',fetchController.getExtraSessions)
router.get('/fetch-ranks',fetchController.getRanks)

router.delete('/delete-teacher',deleteController.deleteTeacher)

router.put('/mark-absence',updateController.markAbsence)
module.exports = router;
