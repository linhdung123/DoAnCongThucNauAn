const mongoose = require('mongoose');

const nguoiDungSchema = new mongoose.Schema({
    tenDangNhap: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    matKhau: {
        type: String,
        required: true
    },
    vaiTro: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    },
    trangThai: {
        type: String,
        default: 'active'
    },
    ngayTao: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // Tắt auto timestamps vì đã có ngayTao
});

module.exports = mongoose.model('NguoiDung', nguoiDungSchema);

