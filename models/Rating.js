const mongoose = require('mongoose');

/**
 * TV F — collection: ratings (đề bài RecipeShare)
 * Mỗi user chỉ một đánh giá cho mỗi công thức (unique compound index).
 */
const ratingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

ratingSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
