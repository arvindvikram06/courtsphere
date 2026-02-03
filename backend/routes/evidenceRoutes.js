const express = require('express');
const router = express.Router();
const { uploadEvidence, getEvidenceByCase } = require('../controllers/evidenceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.post('/', protect, authorize('court'), upload.single('file'), uploadEvidence);
router.get('/:caseId', protect, getEvidenceByCase);

module.exports = router;
