const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Имя пользователя
  password: { type: String, required: true } // Хэшированный пароль
});

module.exports = mongoose.model('User', userSchema);