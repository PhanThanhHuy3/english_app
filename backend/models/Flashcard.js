const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  term: { type: String, required: true },
  definition: { type: String, required: true },
  example: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);
