const jwt = require('jsonwebtoken');

/**
 * Lấy JWT từ Authorization: Bearer <token> hoặc cookie tên `token`.
 * TV B có thể thống nhất cách gửi token (localStorage + Bearer khi fetch).
 */
function getTokenFromRequest(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  const cookie = req.headers.cookie;
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (match) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
  }
  return null;
}

/**
 * Gắn req.user & res.locals.currentUser nếu token hợp lệ (không bắt buộc đăng nhập).
 */
function optionalAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    req.user = null;
    res.locals.currentUser = null;
    return next();
  }
  try {
    const payload = jwt.verify(token, secret);
    const userId = payload.userId || payload.id || payload.sub;
    req.user = { userId: userId ? String(userId) : null, ...payload };
    res.locals.currentUser = req.user;
  } catch {
    req.user = null;
    res.locals.currentUser = null;
  }
  next();
}

/**
 * Bắt buộc đăng nhập — dùng cho POST/DELETE bình luận.
 */
function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    return res.status(401).json({ message: 'Cần đăng nhập để thực hiện thao tác này.' });
  }
  try {
    const payload = jwt.verify(token, secret);
    const userId = payload.userId || payload.id || payload.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Token không hợp lệ.' });
    }
    req.user = { userId: String(userId), ...payload };
    res.locals.currentUser = req.user;
    next();
  } catch {
    return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  }
}

module.exports = { optionalAuth, requireAuth, getTokenFromRequest };
