const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    caseNumber: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['normal', 'probono'],
        required: true
    },
    status: {
        type: String,
        enum: ['ongoing', 'dismissed', 'judgement given'],
        default: 'ongoing'
    },
    complainant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accusedDetails: {
        name: String,
        aadhaar: String,
        address: String
    },
    involvedCitizens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lawyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lawyerRequestStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
    },
    lawyerType: {
        type: String,
        enum: ['public', 'personal', 'none'],
        default: 'none'
    },
    hearings: [{
        date: Date,
        update: String,
        uploadedBy: String // court
    }],
    judgement: {
        summary: String,
        date: Date,
        fileUrl: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Case', CaseSchema);
