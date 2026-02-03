const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId });

    if (user && (await user.comparePassword(password))) {
        res.json({
            _id: user._id,
            userId: user.userId,
            name: user.name,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Citizen) / Restricted (Superadmin for others)
const registerUser = async (req, res) => {
    const { userId, name, password, role, phone, dob, aadhaar, specialization } = req.body;

    const userExists = await User.findOne({ userId });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Role restriction logic can be added here
    // For now, allow registration if superadmin is not required or if role is citizen

    const user = await User.create({
        userId,
        name,
        password,
        role,
        phone,
        dob,
        aadhaar,
        specialization
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            userId: user.userId,
            name: user.name,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

module.exports = { loginUser, registerUser };
