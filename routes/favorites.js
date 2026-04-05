const express = require('express');
const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');
const { requireAuth, requireAuthPage } = require('../middleware/authMiddleware');

const router = express.Router();

function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

/**
 * Thống kê — top món được yêu thích nhất (theo số lượt lưu Favorite),
 * kèm điểm sao trung bình từ Rating. Trang công khai.
 */
router.get('/top', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 24);

    const favAgg = await Favorite.aggregate([
      { $group: { _id: '$recipeId', favoriteCount: { $sum: 1 } } },
      { $sort: { favoriteCount: -1 } },
      { $limit: limit },
    ]);

    const recipeIds = favAgg.map((x) => x._id).filter(Boolean);
    const favMap = new Map(favAgg.map((x) => [String(x._id), x.favoriteCount]));

    const ratingAgg = await Rating.aggregate([
      { $group: { _id: '$recipeId', avgStars: { $avg: '$stars' }, ratingCount: { $sum: 1 } } },
    ]);
    const ratingMap = new Map(
      ratingAgg.map((x) => [
        String(x._id),
        {
          avg: x.avgStars != null ? Math.round(x.avgStars * 10) / 10 : null,
          count: x.ratingCount,
        },
      ])
    );

    let topItems = [];
    if (recipeIds.length) {
      const recipes = await Recipe.find({ _id: { $in: recipeIds } })
        .select('title description image category cookTime difficulty')
        .lean();
      const byId = new Map(recipes.map((r) => [String(r._id), r]));
      topItems = recipeIds
        .map((id) => {
          const r = byId.get(String(id));
          if (!r) return null;
          const rid = String(r._id);
          const rt = ratingMap.get(rid) || { avg: null, count: 0 };
          return {
            recipe: r,
            favoriteCount: favMap.get(rid) || 0,
            avgRating: rt.avg,
            ratingCount: rt.count,
          };
        })
        .filter(Boolean);
    }

    res.render('favorites/top-stats', {
      title: 'Top món ăn được yêu thích nhất',
      topItems,
      limit,
    });
  } catch (err) {
    next(err);
  }
});

/** Trang "Yêu thích của tôi" — bắt buộc đăng nhập */
router.get('/my-favorites', requireAuthPage, async (req, res, next) => {
  try {
    const userId = toObjectId(req.user.userId);
    if (!userId) {
      return res.redirect('/auth');
    }
    const favorites = await Favorite.find({ userId })
      .populate('recipeId')
      .sort({ savedAt: -1 })
      .lean();

    const items = favorites.filter((f) => f.recipeId);

    res.render('favorites/my-favorites', {
      title: 'Món ăn yêu thích của tôi',
      favorites: items,
    });
  } catch (err) {
    next(err);
  }
});

/** Lưu / bỏ lưu yêu thích */
router.post('/toggle/:recipeId', requireAuth, async (req, res) => {
  try {
    const recipeId = toObjectId(req.params.recipeId);
    const userId = toObjectId(req.user.userId);
    if (!recipeId || !userId) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    }
    const recipe = await Recipe.findById(recipeId).select('_id').lean();
    if (!recipe) {
      return res.status(404).json({ message: 'Không tìm thấy công thức.' });
    }

    const existing = await Favorite.findOne({ userId, recipeId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({ favorited: false });
    }
    await Favorite.create({ userId, recipeId, savedAt: new Date() });
    return res.json({ favorited: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Không thể cập nhật yêu thích.' });
  }
});

/** Gửi hoặc cập nhật đánh giá (mỗi user 1 lần / công thức) */
router.post('/rating/:recipeId', requireAuth, async (req, res) => {
  try {
    const recipeId = toObjectId(req.params.recipeId);
    const userId = toObjectId(req.user.userId);
    if (!recipeId || !userId) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    }
    const recipe = await Recipe.findById(recipeId).select('_id').lean();
    if (!recipe) {
      return res.status(404).json({ message: 'Không tìm thấy công thức.' });
    }

    const stars = Number(req.body.stars);
    const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';

    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Số sao phải từ 1 đến 5.' });
    }

    const doc = await Rating.findOneAndUpdate(
      { userId, recipeId },
      { stars, comment },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      rating: {
        _id: doc._id,
        stars: doc.stars,
        comment: doc.comment,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Không thể lưu đánh giá.' });
  }
});

/** Xóa đánh giá của chính mình */
router.delete('/rating/:ratingId', requireAuth, async (req, res) => {
  try {
    const ratingId = toObjectId(req.params.ratingId);
    const userId = toObjectId(req.user.userId);
    if (!ratingId || !userId) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    }
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
    }
    if (rating.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bạn không thể xóa đánh giá này.' });
    }
    await Rating.deleteOne({ _id: ratingId });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Không thể xóa đánh giá.' });
  }
});

/** Tất cả đánh giá của một công thức + điểm trung bình + trạng thái viewer (nếu đã đăng nhập) */
router.get('/ratings/:recipeId', async (req, res) => {
  try {
    const recipeId = toObjectId(req.params.recipeId);
    if (!recipeId) {
      return res.status(400).json({ message: 'recipeId không hợp lệ.' });
    }

    const ratings = await Rating.find({ recipeId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 })
      .lean();

    let average = null;
    if (ratings.length) {
      const sum = ratings.reduce((s, r) => s + r.stars, 0);
      average = Math.round((sum / ratings.length) * 10) / 10;
    }

    const authenticated = !!(req.user && req.user.userId);
    const viewer = { favorited: false, myRating: null };
    if (authenticated) {
      const uid = toObjectId(req.user.userId);
      if (uid) {
        const fav = await Favorite.findOne({ userId: uid, recipeId }).select('_id').lean();
        viewer.favorited = !!fav;
        const mine = await Rating.findOne({ userId: uid, recipeId }).lean();
        if (mine) {
          viewer.myRating = {
            _id: mine._id,
            stars: mine.stars,
            comment: mine.comment,
            createdAt: mine.createdAt,
          };
        }
      }
    }

    return res.json({
      ratings,
      average,
      count: ratings.length,
      viewer,
      authenticated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Không tải được đánh giá.' });
  }
});

module.exports = router;
