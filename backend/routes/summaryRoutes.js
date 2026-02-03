const express = require('express');
const router = express.Router();
const { upsertSummary, getSummaryByCase } = require('../controllers/summaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('court'), upsertSummary);
router.get('/:caseId', protect, getSummaryByCase);

module.exports = router;
