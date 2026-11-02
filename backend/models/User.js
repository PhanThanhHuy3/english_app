const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['learner', 'manager'], default: 'learner' },
  courseLevel: { type: String, default: 'B1' },
  isActive: { type: Boolean, default: true },
  xp: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
