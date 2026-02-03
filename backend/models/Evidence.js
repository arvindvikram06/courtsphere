const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: String,
    fileUrl: String,
    fileType: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Evidence', EvidenceSchema);
