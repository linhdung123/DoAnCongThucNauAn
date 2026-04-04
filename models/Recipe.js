const mongoose = require('mongoose');

/**
 * Công thức — TV C (add-recipe).
 * `author`: ref User theo phân công đồ án.
 * `userId`: giữ đồng bộ với `author` khi lưu để TV A populate('userId') trên trang chủ vẫn hoạt động.
 */
const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    ingredients: { type: [String], default: [] },
    steps: { type: [String], default: [] },
    cookTime: { type: Number, default: null },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    category: { type: String, default: 'Món Việt', trim: true },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
