const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn('Cảnh báo: MONGODB_URI chưa được đặt trong .env');
}

mongoose
  .connect(uri || 'mongodb://127.0.0.1:27017/doan_recipes')
  .then(() => console.log('Đã kết nối MongoDB'))
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });

module.exports = mongoose;
