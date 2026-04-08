const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Имя пользователя
  password: { type: String, required: true }, // Хэшированный пароль
  role: { type: String, default: 'user' } // Роль: 'user' или 'admin'
});

module.exports = mongoose.model('User', userSchema);