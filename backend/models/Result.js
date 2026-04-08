const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },  // Дата по умолчанию текущая
  wpm: Number,  // Просто Number, без required
  accuracy: Number,
  errors: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Ссылка на пользователя
});

module.exports = mongoose.model('Result', resultSchema);