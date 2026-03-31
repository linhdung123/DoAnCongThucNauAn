const mongoose = require('mongoose');

const binhLuanSchema = new mongoose.Schema({
  monAnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MonAn',       // Trỏ tới model MonAn
    required: true
  },
  nguoiDungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',   // Trỏ tới model NguoiDung
    required: true
  },
  noiDung: {
    type: String,
    required: true,
    trim: true
  },

  trangThai: {
    type: String,
    enum: ['active', 'hidden'],
    default: 'active'
  },
  ngayBinhLuan: {
    type: Date,
    default: Date.now
  },
  noiDung: {
    type: String,
    trim: true
  },
  soSao: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
},
  {
    timestamps: false // Tắt auto timestamps vì đã có ngayBinhLuan
  });

module.exports = mongoose.model('BinhLuan', binhLuanSchema);
