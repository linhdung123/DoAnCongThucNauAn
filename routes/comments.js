const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/** GET /comments/:recipeId — tất cả bình luận của một công thức (JSON cho partial/fetch) */
router.get('/:recipeId', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    if (!mongoose.isValidObjectId(recipeId)) {
      return res.status(400).json({ message: 'recipeId không hợp lệ.' });
    }
    const exists = await Recipe.exists({ _id: recipeId });
    if (!exists) {
      return res.status(404).json({ message: 'Không tìm thấy công thức.' });
    }
    const comments = await Comment.find({ recipeId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username avatar')
      .lean();

    const currentUserId = req.user?.userId || null;
    const list = comments.map((c) => {
      const u = c.userId;
      const isPopulated = u && typeof u === 'object' && u.username !== undefined;
      return {
        _id: c._id,
        content: c.content,
        createdAt: c.createdAt,
        user: isPopulated
          ? { username: u.username, avatar: u.avatar || '' }
          : { username: 'Người dùng', avatar: '' },
        isOwner: currentUserId && String(u?._id || u) === String(currentUserId),
      };
    });

    res.json({ comments: list });
  } catch (err) {
    next(err);
  }
});

/** POST /comments/:recipeId — gửi bình luận (cần đăng nhập) */
router.post('/:recipeId', requireAuth, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    if (!mongoose.isValidObjectId(recipeId)) {
      return res.status(400).json({ message: 'recipeId không hợp lệ.' });
    }
    const exists = await Recipe.exists({ _id: recipeId });
    if (!exists) {
      return res.status(404).json({ message: 'Không tìm thấy công thức.' });
    }
    const content = (req.body.content || '').trim();
    if (!content) {
      return res.status(400).json({ message: 'Nội dung bình luận không được để trống.' });
    }

    const comment = await Comment.create({
      recipeId,
      userId: req.user.userId,
      content,
    });
    await comment.populate('userId', 'username avatar');
    const u = comment.userId;
    res.status(201).json({
      comment: {
        _id: comment._id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: u ? { username: u.username, avatar: u.avatar || '' } : { username: 'Người dùng', avatar: '' },
        isOwner: true,
      },
    });
  } catch (err) {
    next(err);
  }
});

/** DELETE /comments/:commentId — chỉ chủ bình luận */
router.delete('/:commentId', requireAuth, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({ message: 'commentId không hợp lệ.' });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận.' });
    }
    if (String(comment.userId) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Bạn chỉ có thể xóa bình luận của chính mình.' });
    }
    await Comment.deleteOne({ _id: commentId });
    res.json({ message: 'Đã xóa bình luận.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
