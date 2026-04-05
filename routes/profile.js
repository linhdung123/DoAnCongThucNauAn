const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg';
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error('Chỉ chấp nhận ảnh JPEG, PNG, GIF hoặc WebP.'));
  },
});

function requireAuthPage(req, res, next) {
  if (!req.user?.userId) {
    return res.status(401).send(
      '<!DOCTYPE html><html lang="vi"><meta charset="utf-8"><title>Cần đăng nhập</title><body style="font-family:sans-serif;padding:2rem"><p>Bạn cần đăng nhập để truy cập trang này.</p><p><a href="/">Về trang chủ</a></p></body></html>'
    );
  }
  next();
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
}

async function loadProfilePayload(userId) {
  const user = await User.findById(userId);
  if (!user) return null;
  const recipes = await Recipe.find({ userId }).sort({ createdAt: -1 }).lean();
  const totalLikesReceived = recipes.reduce((sum, r) => sum + (Number(r.likes) || 0), 0);
  return { user, recipes, totalLikesReceived };
}

router.get('/edit', requireAuthPage, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('+passwordHash');
    if (!user) {
      return res.status(404).send('Không tìm thấy người dùng.');
    }
    res.render('profile/edit-profile', {
      title: 'Chỉnh sửa hồ sơ',
      user,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/edit', requireAuthPage, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      return User.findById(req.user.userId)
        .select('+passwordHash')
        .then((user) =>
          res.status(400).render('profile/edit-profile', {
            title: 'Chỉnh sửa hồ sơ',
            user,
            error: err.message || 'Lỗi tải file.',
          })
        )
        .catch(next);
    }
    next();
  });
}, async (req, res, next) => {
  try {
    const sessionId = String(req.user.userId);
    const user = await User.findById(sessionId).select('+passwordHash');
    if (!user) {
      return res.status(404).send('Không tìm thấy người dùng.');
    }

    const { username, bio, oldPassword, newPassword, confirmPassword } = req.body;
    if (typeof username === 'string' && username.trim()) {
      user.username = username.trim();
    }
    if (typeof bio === 'string') {
      user.bio = bio.trim();
    }
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    const wantsPasswordChange = Boolean(
      (oldPassword && String(oldPassword)) ||
        (newPassword && String(newPassword)) ||
        (confirmPassword && String(confirmPassword))
    );

    if (wantsPasswordChange) {
      const oldPw = oldPassword ? String(oldPassword) : '';
      const newPw = newPassword ? String(newPassword) : '';
      const confirmPw = confirmPassword ? String(confirmPassword) : '';

      if (!oldPw || !newPw || newPw !== confirmPw) {
        return res.status(400).render('profile/edit-profile', {
          title: 'Chỉnh sửa hồ sơ',
          user,
          error: 'Vui lòng nhập đầy đủ mật khẩu cũ, mật khẩu mới và xác nhận trùng khớp.',
        });
      }

      if (!user.passwordHash) {
        return res.status(400).render('profile/edit-profile', {
          title: 'Chỉnh sửa hồ sơ',
          user,
          error: 'Tài khoản chưa có mật khẩu lưu trên hệ thống (đăng ký qua TV B).',
        });
      }

      const match = await bcrypt.compare(oldPw, user.passwordHash);
      if (!match) {
        return res.status(400).render('profile/edit-profile', {
          title: 'Chỉnh sửa hồ sơ',
          user,
          error: 'Mật khẩu cũ không đúng.',
        });
      }

      user.passwordHash = await bcrypt.hash(newPw, 10);
    }

    await user.save();
    res.redirect('/profile?saved=1');
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuthPage, async (req, res, next) => {
  try {
    const data = await loadProfilePayload(req.user.userId);
    if (!data) {
      return res.status(404).send('Không tìm thấy người dùng.');
    }
    const isOwner = true;
    res.render('profile/profile', {
      title: 'Hồ sơ cá nhân',
      ...data,
      isOwner,
      saved: req.query.saved === '1',
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(404).send('Không tìm thấy hồ sơ.');
    }
    const data = await loadProfilePayload(userId);
    if (!data) {
      return res.status(404).send('Không tìm thấy hồ sơ.');
    }
    const isOwner = Boolean(req.user?.userId && String(req.user.userId) === String(data.user._id));
    res.render('profile/profile', {
      title: `Hồ sơ — ${data.user.username}`,
      ...data,
      isOwner,
      saved: false,
    });
  } catch (err) {
    next(err);
  }
});
