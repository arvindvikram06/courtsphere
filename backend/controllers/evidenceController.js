const Evidence = require('../models/Evidence');
const Case = require('../models/Case');

// @desc    Upload evidence
// @route   POST /api/evidence
// @access  Private (Court)
const uploadEvidence = async (req, res) => {
    try {
        const { caseId, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const evidence = await Evidence.create({
            case: caseId,
            uploadedBy: req.user._id,
            fileName: req.file.filename,
            fileUrl: `/uploads/${req.file.filename}`,
            fileType: req.file.mimetype,
            description
        });

        res.status(201).json(evidence);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get evidence for a case
// @route   GET /api/evidence/:caseId
// @access  Private (Involved parties)
const getEvidenceByCase = async (req, res) => {
    try {
        const caseObj = await Case.findById(req.params.caseId);

        if (!caseObj) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // Check if user is involved
        const isInvolved = req.user.role === 'court' ||
            req.user.role === 'superadmin' ||
            caseObj.complainant.toString() === req.user._id.toString() ||
            caseObj.lawyer?.toString() === req.user._id.toString() ||
            caseObj.involvedCitizens.includes(req.user._id);

        if (!isInvolved) {
            return res.status(403).json({ message: 'Not authorized to view evidence for this case' });
        }

        const evidence = await Evidence.find({ case: req.params.caseId }).populate('uploadedBy', 'name role');
        res.json(evidence);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { uploadEvidence, getEvidenceByCase };
