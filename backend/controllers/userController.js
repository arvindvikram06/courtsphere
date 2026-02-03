const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            userId: user.userId,
            name: user.name,
            role: user.role,
            phone: user.phone,
            dob: user.dob,
            aadhaar: user.aadhaar,
            specialization: user.specialization,
            availability: user.availability,
            casesHandled: user.casesHandled,
            casesWon: user.casesWon
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            userId: updatedUser.userId,
            name: updatedUser.name,
            role: updatedUser.role,
            phone: updatedUser.phone,
            token: null // Token stays same
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all lawyers
// @route   GET /api/users/lawyers
// @access  Private
const getLawyers = async (req, res) => {
    const lawyers = await User.find({ role: 'lawyer' }).select('-password');
    res.json(lawyers);
};

module.exports = { getUserProfile, updateUserProfile, getLawyers };
