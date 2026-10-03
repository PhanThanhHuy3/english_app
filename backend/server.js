const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/english_app';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Tạo tài khoản admin mặc định nếu chưa có
    const seedAdmin = async () => {
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');
      const adminExists = await User.findOne({ email: 'admin@manager.com' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        await User.create({ name: 'Admin', email: 'admin@manager.com', password: hashedPassword, role: 'manager' });
        console.log('✅ Default Admin created (admin@manager.com / admin)');
      }
    };
    seedAdmin();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
