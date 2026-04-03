const mongoose = require('mongoose');

/**
 * Schema tối thiểu để populate bình luận (TV B có thể mở rộng: email, passwordHash…)
 */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
