const express = require('express');
const router = express.Router();
const periodController = require('../controllers/periodController');

router.post('/', periodController.createPeriod);
router.patch('/:id', periodController.updatePeriod);
router.delete('/:id', periodController.deletePeriod);

module.exports = router;