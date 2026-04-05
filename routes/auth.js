const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET chưa cấu hình');
  }
  return jwt.sign({ userId: String(userId) }, secret, { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  });
}

router.get('/', (req, res) => {
  res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Đăng nhập — Cooks Delight' });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup', { title: 'Đăng ký — Cooks Delight' });
});

router.get('/forgot', (req, res) => {
  res.render('auth/forgot', { title: 'Quên mật khẩu — Cooks Delight' });
});

router.post('/login', async (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Máy chủ chưa cấu hình JWT_SECRET.' });
    }
    const username = (req.body.username || '').trim();
    const password = req.body.password || '';
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }
    const user = await User.findOne({
      username: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }
    const token = signToken(user._id);
    setAuthCookie(res, token);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Máy chủ chưa cấu hình JWT_SECRET.' });
    }
    const username = (req.body.username || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đủ username, email và mật khẩu.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu cần ít nhất 6 ký tự.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });
    const token = signToken(user._id);
    setAuthCookie(res, token);
    res.status(201).json({ token });
  } catch (err) {
    if (err.code === 11000) {
      const field = err.keyPattern && Object.keys(err.keyPattern)[0];
      const label = field === 'email' ? 'Email' : 'Tên đăng nhập';
      return res.status(409).json({ message: `${label} đã được sử dụng.` });
    }
    next(err);
  }
});

/** Stub — chưa gửi email thật (theo UI Figma SEND CODE) */
router.post('/forgot', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ message: 'Vui lòng nhập email.' });
  }
  res.json({
    message:
      'Tính năng gửi mã đặt lại mật khẩu qua email đang được triển khai. Vui lòng liên hệ quản trị hoặc đăng ký tài khoản mới.',
  });
});

module.exports = router;
