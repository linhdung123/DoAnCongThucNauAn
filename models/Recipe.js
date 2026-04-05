const mongoose = require('mongoose');

/**
 * Schema tối thiểu cho trang chủ & ref Comment (TV C/D mở rộng thêm bước nấu, nguyên liệu…)
 */
const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    category: { type: String, default: 'Món Việt', trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    /** Mỗi phần tử: một dòng nguyên liệu, ví dụ "200g thịt bò" */
    ingredients: { type: [String], default: [] },
    /** Các bước nấu theo thứ tự */
    steps: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
