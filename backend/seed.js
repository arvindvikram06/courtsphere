const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const users = [
    {
        userId: 'SUP-001',
        name: 'Super Admin',
        password: 'password123',
        role: 'superadmin',
        phone: '1234567890'
    },
    {
        userId: 'CRT-001',
        name: 'Supreme Court 1',
        password: 'password123',
        role: 'court',
        phone: '1234567891'
    },
    {
        userId: 'PS-001',
        name: 'City Police Station',
        password: 'password123',
        role: 'police',
        phone: '1234567892'
    },
    {
        userId: 'LAW-001',
        name: 'John Doe Esquire',
        password: 'password123',
        role: 'lawyer',
        phone: '1234567893',
        aadhaar: '1234-5678-9012',
        specialization: 'Criminal Law',
        availability: true,
        casesHandled: 45,
        casesWon: 30
    },
    {
        userId: 'FIN-001',
        name: 'Finance Dept',
        password: 'password123',
        role: 'finance',
        phone: '1234567894'
    },
    {
        userId: '1234-1234-1234',
        name: 'Common Citizen',
        password: 'password123',
        role: 'citizen',
        phone: '9876543210',
        aadhaar: '1234-1234-1234',
        dob: '1990-01-01'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        await User.deleteMany();
        console.log('Cleared existing users.');

        const hashedUsers = await Promise.all(users.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            return user;
        }));

        await User.insertMany(hashedUsers);
        console.log('Seeded initial users with hashed passwords.');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
