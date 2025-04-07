const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rankController');

router.post('/', rankController.createRank);
router.patch('/:id', rankController.updateRank);
router.delete('/:id', rankController.deleteRank);
router.get('/', rankController.getAllRanks);
router.get('/:id', rankController.getRankById);

module.exports = router;