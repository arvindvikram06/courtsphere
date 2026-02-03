const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('CourtSphere API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
