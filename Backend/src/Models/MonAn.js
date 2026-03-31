const mongoose = require('mongoose');

// Schema cho nguyên liệu (embedded document)
const nguyenLieuSchema = new mongoose.Schema({
    ten: {
        type: String,
        required: true,
        trim: true
    },
    soLuong: {
        type: String,
        required: true,
        trim: true
    }
}, {
    _id: false // Không tạo _id cho embedded document
});

// Schema cho hướng dẫn từng bước (embedded document)
const huongDanSchema = new mongoose.Schema({
    buoc: {
        type: Number,
        required: true
    },
    moTa: {
        type: String,
        required: true,
        trim: true
    },
    hinhAnh: {
        type: String,
        trim: true
    }
}, {
    _id: false // Không tạo _id cho embedded document
});

const monAnSchema = new mongoose.Schema({
    tenMon: {
        type: String,
        required: true,
        trim: true
    },
    moTa: {
        type: String,
        trim: true
    },
    hinhAnh: {
        type: String,
        trim: true
    },
    videoHuongDan: {
        type: String,
        trim: true
    },
    chuDeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChuDe',
        required: true
    },
    nguoiTao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
        required: true
    },
    nguyenLieu: {
        type: [nguyenLieuSchema],
        default: []
    },
    huongDan: {
        type: [huongDanSchema],
        default: []
    },
    trangThai: {
        type: String,
        default: 'active'
    },
    ngayTao: {
        type: Date,
        default: Date.now
    },
     diemDanhGia: {
        type: Number,    
        default: 0
    },
    tongLuotDanhGia: {
        type: Number,   
        default: 0
    },
}, {
    timestamps: false // Tắt auto timestamps vì đã có ngayTao
});

module.exports = mongoose.model('MonAn', monAnSchema);

