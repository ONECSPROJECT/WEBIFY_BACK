const express = require('express');
const router = express.Router();
const AbsenceController = require('../controllers/absenceController');

router.post('/single', AbsenceController.createSingleDayAbsence);
router.post('/long-term', AbsenceController.createLongTermAbsence);
router.get('/:professor_id', AbsenceController.getProfessorAbsences);
router.delete('/single/:record_id', AbsenceController.deleteSingleDayAbsence);
router.delete('/long-term', AbsenceController.deleteLongTermAbsence);

module.exports = router;