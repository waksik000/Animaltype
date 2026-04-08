const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },  // Дата по умолчанию текущая
  wpm: Number,  // Просто Number, без required
  accuracy: Number,
  errors: Number
});

module.exports = mongoose.model('Result', resultSchema);