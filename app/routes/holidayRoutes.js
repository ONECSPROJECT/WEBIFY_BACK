const express = require('express');
const router = express.Router();
const HolidayController = require('../controllers/holidayController');

router.post('/', HolidayController.createHoliday);
router.patch('/:id', HolidayController.updateHoliday);
router.delete('/:id', HolidayController.deleteHoliday);
router.get('/', HolidayController.getAllHolidays);
router.get('/:id', HolidayController.getHolidayById);

module.exports = router;
