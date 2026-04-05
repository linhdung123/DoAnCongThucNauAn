const express = require('express');

/** TV B — đăng ký / đăng nhập / JWT */
const router = express.Router();

router.get('/', (req, res) => res.redirect('/auth/login'));

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Đăng nhập — Cooks Delight', error: null, email: '' });
});

router.post('/login', (req, res) => {
  const email = (req.body.email || '').trim();
  const { password } = req.body;
  if (!email || !password) {
    return res.render('auth/login', {
      title: 'Đăng nhập — Cooks Delight',
      error: 'Vui lòng nhập email và mật khẩu.',
      email,
    });
  }
  return res.render('auth/login', {
    title: 'Đăng nhập — Cooks Delight',
    error: 'Xử lý đăng nhập (JWT + MongoDB) sẽ được TV B nối tiếp trong routes/auth.js.',
    email,
  });
});

router.get('/register', (req, res) => {
  res.render('auth/register', {
    title: 'Đăng ký — Cooks Delight',
    error: null,
    fullName: '',
    email: '',
  });
});

router.post('/register', (req, res) => {
  const fullName = (req.body.fullName || '').trim();
  const email = (req.body.email || '').trim();
  const { password, password2 } = req.body;
  if (!fullName || !email || !password || !password2) {
    return res.render('auth/register', {
      title: 'Đăng ký — Cooks Delight',
      error: 'Vui lòng điền đủ các trường.',
      fullName,
      email,
    });
  }
  if (password !== password2) {
    return res.render('auth/register', {
      title: 'Đăng ký — Cooks Delight',
      error: 'Mật khẩu xác nhận không khớp.',
      fullName,
      email,
    });
  }
  return res.render('auth/register', {
    title: 'Đăng ký — Cooks Delight',
    error: 'Lưu user + bcrypt + redirect sẽ được TV B hoàn thiện theo models/User.js.',
    fullName,
    email,
  });
});

router.get('/forgot-password', (req, res) => {
  res.render('auth/forgot-password', { title: 'Quên mật khẩu', error: null, info: null, email: '' });
});

router.post('/forgot-password', (req, res) => {
  const email = (req.body.email || '').trim();
  if (!email) {
    return res.render('auth/forgot-password', {
      title: 'Quên mật khẩu',
      error: 'Vui lòng nhập email.',
      info: null,
      email: '',
    });
  }
  return res.render('auth/forgot-password', {
    title: 'Quên mật khẩu',
    error: null,
    info: 'Gửi mã / đặt lại mật khẩu cần email service — hiện chỉ là giao diện theo Figma.',
    email,
  });
});

module.exports = router;
