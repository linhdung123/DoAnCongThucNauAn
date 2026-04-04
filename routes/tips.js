const express = require('express');
const mongoose = require('mongoose');
const Tip = require('../models/Tip');

const router = express.Router();

const TIP_CATEGORIES = ['Chiên - Xào', 'Nấu - Luộc', 'Sơ chế', 'Bảo quản'];

const DEFAULT_TIPS = [
  {
    title: 'Chiên – Xào đúng cách',
    summary: 'Giúp món ăn vàng đều, không khô',
    category: 'Chiên - Xào',
    timingNote: 'Áp dụng hằng ngày',
    image: '',
    content:
      'Để chiên vàng đều: lau khô bề mặt thực phẩm, chảo nóng vừa rồi mới cho dầu, không đảo quá nhiều khi lớp ngoài chưa se.',
  },
  {
    title: 'Nấu – Luộc ngon hơn',
    summary: 'Giữ trọn hương vị và dinh dưỡng',
    category: 'Nấu - Luộc',
    timingNote: 'Thao tác đơn giản',
    image: '',
    content:
      'Luộc rau: nước sôi mới thả rau, thêm chút muối; nấu canh nên hầm nhỏ lửa phần cuối để nước trong, ngọt tự nhiên.',
  },
  {
    title: 'Sơ chế thực phẩm đúng cách',
    summary: 'Giữ vệ sinh và an toàn khi nấu ăn',
    category: 'Sơ chế',
    timingNote: 'Trước khi nấu',
    image: '',
    content:
      'Rửa tay trước và sau khi chế biến; thớt sống/chín tách riêng; rau và thịt sơ chế trên khay khác nhau.',
  },
  {
    title: 'Bảo quản thực phẩm tươi lâu hơn',
    summary: 'Giữ rau, thịt, cá tươi ngon và an toàn',
    category: 'Bảo quản',
    timingNote: 'Áp dụng hằng ngày',
    image: '',
    content:
      'Thịt cá chia nhỏ, bọc kín, để ngăn mát; rau rửa ráo nước, bọc giấy ẩm rồi túi zip trước khi cho tủ lạnh.',
  },
];

async function ensureSeedTips() {
  const n = await Tip.countDocuments();
  if (n === 0) {
    await Tip.insertMany(DEFAULT_TIPS);
  }
}

/** GET /tips — lọc ?category= */
router.get('/', async (req, res, next) => {
  try {
    await ensureSeedTips();
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const filter = category && TIP_CATEGORIES.includes(category) ? { category } : {};
    const tips = await Tip.find(filter).sort({ createdAt: 1 }).lean();

    res.render('tips/index', {
      title: 'Tips & mẹo nấu ăn',
      tips,
      categories: TIP_CATEGORIES,
      activeCategory: category || '',
    });
  } catch (err) {
    next(err);
  }
});

/** GET /tips/detail/:id */
router.get('/detail/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Không tìm thấy mẹo.');
    }
    await ensureSeedTips();
    const tip = await Tip.findById(id).lean();
    if (!tip) {
      return res.status(404).send('Không tìm thấy mẹo.');
    }
    res.render('tips/detail', {
      title: tip.title + ' — Mẹo nấu ăn',
      tip,
      categories: TIP_CATEGORIES,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
