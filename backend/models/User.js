const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['citizen', 'police', 'court', 'lawyer', 'finance', 'superadmin'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: Date,
    aadhaar: String, // For citizen/lawyer
    specialization: String, // For lawyer
    availability: {
        type: Boolean,
        default: true
    }, // For lawyer
    casesHandled: {
        type: Number,
        default: 0
    }, // For lawyer
    casesWon: {
        type: Number,
        default: 0
    }, // For lawyer
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
