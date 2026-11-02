const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Lấy danh sách tất cả người dùng (ẩn mật khẩu)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách tài khoản' });
  }
});

// Quản trị viên cấp/tạo tài khoản học viên mới
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, courseLevel } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ tên, email và mật khẩu' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại trên hệ thống' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'learner',
      courseLevel: courseLevel || 'B1',
      isActive: true,
      xp: 0
    });

    await newUser.save();

    // Trả về user không có password
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json(userToReturn);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo người dùng' });
  }
});

// Cập nhật trạng thái kích hoạt (Active / Inactive)
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: 'Cập nhật trạng thái thành công', isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa người dùng
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa tài khoản thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xóa tài khoản' });
  }
});

module.exports = router;
