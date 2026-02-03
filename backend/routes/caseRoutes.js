const express = require('express');
const router = express.Router();
const { registerCase, getCases, updateCase, handleLawyerRequest } = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCases)
    .post(protect, authorize('citizen', 'police'), registerCase);

router.route('/:id')
    .put(protect, authorize('court', 'superadmin'), updateCase);

router.route('/:id/lawyer')
    .put(protect, authorize('lawyer'), handleLawyerRequest);

module.exports = router;
