const mongoose = require('mongoose');

const monYeuThichSchema = new mongoose.Schema({
    nguoiDungId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
        required: true
    },
    monAnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MonAn',
        required: true
    },
    ngayLuu: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // Tắt auto timestamps vì đã có ngayLuu
});

// Tạo index để đảm bảo một user chỉ có thể lưu một món ăn một lần
monYeuThichSchema.index({ nguoiDungId: 1, monAnId: 1 }, { unique: true });

module.exports = mongoose.model('MonYeuThich', monYeuThichSchema);

