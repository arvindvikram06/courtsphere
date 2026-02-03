const express = require('express');
const router = express.Router();
const { createPayment, getPayments, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPayments)
    .post(protect, authorize('citizen'), createPayment);

router.route('/:id')
    .put(protect, authorize('finance', 'superadmin'), verifyPayment);

module.exports = router;
