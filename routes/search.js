const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

/** TV E — tìm kiếm */
router.get('/', async (req, res) => {
  try {
    const { q, category, difficulty, maxTime } = req.query;
    
    // Xây dựng query object cho MongoDB
    let query = {};
    
    if (q) {
      query.title = { $regex: q, $options: 'i' }; // Tìm theo từ khóa không cần chính xác hoa thường
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (maxTime) {
      query.cookTime = { $lte: Number(maxTime) };
    }

    const recipes = await Recipe.find(query).populate('author').sort({ createdAt: -1 });

    // Render EJS view với danh sách các món ăn và giữ lại state của bộ lọc
    res.render('search/index', {
      title: 'Tìm Kiếm & Lọc Công Thức',
      recipes,
      query: req.query // Trả lại query để form tự động fill các trường người dùng đã chọn
    });
  } catch (err) {
    console.error('Lỗi khi thực hiện tìm kiếm:', err);
    res.status(500).send('Đã xảy ra lỗi trong quá trình tìm kiếm.');
  }
});

module.exports = router;
