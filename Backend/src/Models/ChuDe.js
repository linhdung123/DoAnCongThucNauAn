const mongoose = require('mongoose');

const chuDeSchema = new mongoose.Schema({
    tenChuDe: {
        type: String,
        required: true,
        trim: true
    },
    moTa: {
        type: String,
        trim: true
    },
    ngayTao: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // Tắt auto timestamps vì đã có ngayTao
});

module.exports = mongoose.model('ChuDe', chuDeSchema);

