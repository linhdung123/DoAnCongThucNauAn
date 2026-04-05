const express = require('express');
const Recipe = require('../models/Recipe');

const router = express.Router();

/** Danh mục hiển thị trên trang chủ (có thể đồng bộ với dữ liệu Recipe.category sau) */
const CATEGORY_LABELS = ['Món Việt', 'Món Hàn', 'Tráng miệng', 'Món Ý', 'Đồ uống', 'Ăn vặt'];

router.get('/', async (req, res, next) => {
  try {
    const featuredRecipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('userId', 'username avatar')
      .lean();

    res.render('index', {
      title: 'Trang chủ — Cooks Delight',
      navActive: 'home',
      featuredRecipes,
      categories: CATEGORY_LABELS,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
