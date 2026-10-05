const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');

// Lấy danh sách Flashcards
router.get('/', async (req, res) => {
  try {
    const flashcards = await Flashcard.find().sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Thêm Flashcard mới
router.post('/', async (req, res) => {
  try {
    const { term, definition, example } = req.body;
    const newCard = new Flashcard({ term, definition, example });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Xóa Flashcard
router.delete('/:id', async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flashcard deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
