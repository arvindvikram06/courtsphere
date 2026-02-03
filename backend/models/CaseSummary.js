const mongoose = require('mongoose');

const CaseSummarySchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    summaryContent: String,
    finalJudgement: String,
    courtOfficial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CaseSummary', CaseSummarySchema);
