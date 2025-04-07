const express = require('express');
const router = express.Router();
const periodController = require('../controllers/periodController');

router.post('/', periodController.createPeriod);
router.patch('/:id', periodController.updatePeriod);
router.delete('/:id', periodController.deletePeriod);
router.get('/', periodController.getAllPeriods);
router.get('/:id', periodController.getPeriodById);

module.exports = router;