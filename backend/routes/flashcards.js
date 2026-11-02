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

// Thêm Flashcard đơn lẻ
router.post('/', async (req, res) => {
  try {
    const { term, definition, example } = req.body;
    if (!term || !definition) {
      return res.status(400).json({ message: 'Term and definition are required' });
    }
    const newCard = new Flashcard({ term, definition, example });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cập nhật Flashcard (Sửa nội dung, chính tả, ví dụ)
router.put('/:id', async (req, res) => {
  try {
    const { term, definition, example } = req.body;
    const updated = await Flashcard.findByIdAndUpdate(
      req.params.id,
      { term, definition, example },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy thẻ từ vựng' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật thẻ từ vựng' });
  }
});

// Import hàng loạt Flashcards (Batch Import từ CSV)
router.post('/batch', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Danh sách thẻ từ vựng không hợp lệ' });
    }

    // Lọc các item hợp lệ (phải có term và definition)
    const validItems = items
      .filter(item => item.term && item.definition)
      .map(item => ({
        term: item.term.trim(),
        definition: item.definition.trim(),
        example: item.example ? item.example.trim() : ''
      }));

    if (validItems.length === 0) {
      return res.status(400).json({ message: 'Không có từ vựng nào hợp lệ' });
    }

    const inserted = await Flashcard.insertMany(validItems);
    res.status(201).json({
      message: `Đã import thành công ${inserted.length} từ vựng!`,
      count: inserted.length,
      data: inserted
    });
  } catch (err) {
    console.error('Lỗi khi import batch flashcards:', err);
    res.status(500).json({ message: 'Lỗi server khi import dữ liệu' });
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
