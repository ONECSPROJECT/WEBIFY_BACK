const express = require('express');
const authController = require('../controllers/authController');
const passController = require('../controllers/passController');
const authMiddleware = require('../middlewares/authMiddleware');
const fetchController=require('../controllers/fetchController')
const saveController=require('../controllers/saveContoller')
const deleteController=require('../controllers/deleteController')
const updateController=require('../controllers/updateController')
const router = express.Router();
const exportController = require('../controllers/exportController');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/request-reset-password', passController.requestPasswordReset);
router.post('/reset-password', passController.resetPassword);
router.post('/save-holiday',saveController.saveHoliday)
router.post('/save-semesters',saveController.saveSemesters)
router.post('/save-schedule',saveController.saveSched)
router.post('/save-periods',saveController.savePeriods)
router.post('/save-vacation',saveController.saveVacations)
router.post('/update-rank',saveController.saveRank)
router.post('/add-record',saveController.addRecord)



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
router.get('/get-period',fetchController.getPeriod)
router.get('/get-teachers',fetchController.getTeacherForPaymentPage)
router.get('/get-weekend',fetchController.getWeekend)
router.get('/export/pdf', exportController.handleExport)
router.get('/export/excel',exportController.exportExcel)

// testing protect middleware
router.get('/auth', authMiddleware.protect, authController.testProtected);
router.put('/mark-as-paid',updateController.markAsPaid)
router.put('/mask-teacher',updateController.maskTeacher)
router.put('/mark-absence',updateController.markAbsence)
router.put('/mark-enddate',updateController.markEnddate)
router.put('/add-suphoursBySession',updateController.addSupHours)
router.put('/reset-presence',updateController.resetPresence)
module.exports = router;
