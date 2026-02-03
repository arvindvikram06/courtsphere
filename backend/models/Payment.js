const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['registration', 'court', 'lawyer', 'misc', 'fine'],
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'approved', 'rejected'],
        default: 'waiting'
    },
    transactionId: {
        type: String,
        unique: true
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
