const mongoose = require('mongoose');

/**
 * Mẹo nấu ăn — trang /tips (tách biệt collection recipes).
 * Xem trong MongoDB Compass: collection `tips`
 */
const tipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: '', trim: true },
    category: { type: String, required: true, trim: true, index: true },
    image: { type: String, default: '' },
    timingNote: { type: String, default: '', trim: true },
    content: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tip', tipSchema);
