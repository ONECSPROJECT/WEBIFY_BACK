const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: '../uploads/' });

const router = express.Router();

// enable the authMiddleware when needed
// router.post('/upload-schedule', authMiddleware.protect, scheduleController.uploadSchedule);

router.post('/upload-schedule', upload.any(), scheduleController.uploadSchedule);  // No auth middleware for now (dev)

module.exports = router;

