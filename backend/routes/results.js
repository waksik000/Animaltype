const express = require('express');
const router = express.Router();
const Result = require('../models/Result');  // Импортируем модель

// Маршрут для сохранения нового результата (POST /api/results)
router.post('/', async (req, res) => {
  try {
    console.log('Received body:', req.body);
    const result = new Result(req.body);  // Создаём новый объект из данных в теле запроса
    await result.save();  // Сохраняем в базу
    console.log('Saved result:', result);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).send({ error: error.message });  // Если ошибка, отправляем её
  }
});

// Маршрут для получения всех результатов (GET /api/results)
router.get('/', async (req, res) => {
  try {
    const results = await Result.find();  // Находим все результаты в базе
    res.send(results);  // Отправляем массив результатов
  } catch (error) {
    res.status(500).send({ error: error.message });  // Если ошибка, отправляем её
  }
});

module.exports = router;