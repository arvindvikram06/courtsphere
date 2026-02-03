const Case = require('../models/Case');
const User = require('../models/User');

// @desc    Register a new case
// @route   POST /api/cases
// @access  Private (Citizen, Police)
const registerCase = async (req, res) => {
    try {
        const { title, description, type, accusedDetails, involvedCitizens, lawyerType } = req.body;

        const caseCount = await Case.countDocuments();
        const caseNumber = `CASE-${new Date().getFullYear()}-${(caseCount + 1).toString().padStart(4, '0')}`;

        const newCase = await Case.create({
            caseNumber,
            title,
            description,
            type,
            accusedDetails,
            involvedCitizens,
            complainant: req.user._id,
            lawyerType,
            lawyerRequestStatus: lawyerType !== 'none' ? 'pending' : 'none'
        });

        res.status(201).json(newCase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all cases
// @route   GET /api/cases
// @access  Private
const getCases = async (req, res) => {
    try {
        let cases;
        if (req.user.role === 'court' || req.user.role === 'superadmin' || req.user.role === 'finance') {
            cases = await Case.find({}).populate('complainant lawyer');
        } else if (req.user.role === 'lawyer') {
            cases = await Case.find({ lawyer: req.user._id }).populate('complainant lawyer');
            // Also include pending requests
            const requests = await Case.find({ lawyerRequestStatus: 'pending', lawyerType: 'public' }).populate('complainant');
            // This is a bit complex for a single query, but let's just return what matters to them
            cases = await Case.find({
                $or: [
                    { lawyer: req.user._id },
                    { lawyerRequestStatus: 'pending', lawyerType: 'public' }
                ]
            }).populate('complainant lawyer');
        } else {
            // Citizen or Police - only cases where they are complainant or involved
            cases = await Case.find({
                $or: [
                    { complainant: req.user._id },
                    { involvedCitizens: req.user._id }
                ]
            }).populate('complainant lawyer');
        }
        res.json(cases);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update case status/judgement
// @route   PUT /api/cases/:id
// @access  Private (Court)
const updateCase = async (req, res) => {
    try {
        const { status, judgement, hearing } = req.body;
        const caseObj = await Case.findById(req.params.id);

        if (!caseObj) {
            return res.status(404).json({ message: 'Case not found' });
        }

        if (status) caseObj.status = status;
        if (judgement) caseObj.judgement = judgement;
        if (hearing) caseObj.hearings.push(hearing);

        const updatedCase = await caseObj.save();
        res.json(updatedCase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Handle lawyer request (Accept/Reject)
// @route   PUT /api/cases/:id/lawyer
// @access  Private (Lawyer)
const handleLawyerRequest = async (req, res) => {
    try {
        const { action } = req.body; // 'accept' or 'reject'
        const caseObj = await Case.findById(req.params.id);

        if (!caseObj) {
            return res.status(404).json({ message: 'Case not found' });
        }

        if (action === 'accept') {
            caseObj.lawyer = req.user._id;
            caseObj.lawyerRequestStatus = 'approved';
        } else {
            caseObj.lawyerRequestStatus = 'rejected';
        }

        const updatedCase = await caseObj.save();
        res.json(updatedCase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { registerCase, getCases, updateCase, handleLawyerRequest };
