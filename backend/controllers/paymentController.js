const Payment = require('../models/Payment');

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private (Citizen)
const createPayment = async (req, res) => {
    try {
        const { caseId, amount, type } = req.body;
        const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const payment = await Payment.create({
            case: caseId,
            user: req.user._id,
            amount,
            type,
            transactionId,
            status: 'waiting'
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
    try {
        let payments;
        if (req.user.role === 'finance' || req.user.role === 'superadmin') {
            payments = await Payment.find({}).populate('case user');
        } else {
            payments = await Payment.find({ user: req.user._id }).populate('case');
        }
        res.json(payments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Verify payment
// @route   PUT /api/payments/:id
// @access  Private (Finance Manager)
const verifyPayment = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status;
        payment.verifiedBy = req.user._id;

        const updatedPayment = await payment.save();
        res.json(updatedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createPayment, getPayments, verifyPayment };
