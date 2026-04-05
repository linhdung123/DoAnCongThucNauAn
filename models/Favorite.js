const mongoose = require('mongoose');

/**
 * TV F — collection: favorites (đề bài RecipeShare)
 * userId + recipeId: mỗi user chỉ lưu một lần cho mỗi công thức.
 */
const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
