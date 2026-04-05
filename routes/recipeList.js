const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

/** TV D — danh sách & trang chi tiết công thức */
const router = express.Router();

const CATEGORY_LABELS = ['Món Việt', 'Món Hàn', 'Tráng miệng', 'Món Ý', 'Đồ uống', 'Ăn vặt'];

router.get('/', async (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const filter = category ? { category } : {};
    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'username avatar')
      .lean();

    res.render('recipes/list', {
      title: category ? `Công thức — ${category}` : 'Tất cả công thức',
      recipes,
      categories: CATEGORY_LABELS,
      activeCategory: category,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).send('Không tìm thấy công thức');
      return;
    }

    const recipe = await Recipe.findById(id).populate('userId', 'username avatar').lean();
    if (!recipe) {
      res.status(404).send('Không tìm thấy công thức');
      return;
    }

    res.render('recipes/detail', {
      title: recipe.title,
      recipe,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
