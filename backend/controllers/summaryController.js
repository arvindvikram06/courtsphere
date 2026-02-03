const CaseSummary = require('../models/CaseSummary');

// @desc    Create or Update case summary
// @route   POST /api/summary
// @access  Private (Court)
const upsertSummary = async (req, res) => {
    try {
        const { caseId, summaryContent, finalJudgement } = req.body;

        let summary = await CaseSummary.findOne({ case: caseId });

        if (summary) {
            summary.summaryContent = summaryContent;
            summary.finalJudgement = finalJudgement;
            summary.courtOfficial = req.user._id;
            summary.updatedAt = Date.now();
            await summary.save();
        } else {
            summary = await CaseSummary.create({
                case: caseId,
                summaryContent,
                finalJudgement,
                courtOfficial: req.user._id
            });
        }

        res.json(summary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get summary by case
// @route   GET /api/summary/:caseId
// @access  Private
const getSummaryByCase = async (req, res) => {
    try {
        const summary = await CaseSummary.findOne({ case: req.params.caseId }).populate('courtOfficial', 'name');
        if (!summary) {
            return res.status(404).json({ message: 'Summary not found' });
        }
        res.json(summary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { upsertSummary, getSummaryByCase };
