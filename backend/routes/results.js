const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Result = require('../models/Result');

// Middleware для проверки JWT токена
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send({ error: 'Доступ запрещён. Токен не предоставлен.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Используем переменную окружения
    next();
  } catch (error) {
    res.status(401).send({ error: 'Неверный токен.' });
  }
};

// Маршрут для сохранения нового результата (POST /api/results) — требует аутентификации
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received body:', req.body);
    const result = new Result({ ...req.body, userId: req.user.userId }); // Добавляем userId из токена
    await result.save();
    console.log('Saved result:', result);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).send({ error: error.message });  // Если ошибка, отправляем её
  }
});

// Получение всех результатов пользователя (GET /api/results) — требует аутентификации
router.get('/', auth, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.userId }); // Только результаты текущего пользователя
    res.send(results);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Получения таблицы лидеров (GET /api/results/leaderboard) — публичный
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: '$userId',
          maxWpm: { $max: '$wpm' },
          bestResult: { $first: '$$ROOT' } // Берем первый документ с максимальным WPM
        }
      },
      {
        $sort: { maxWpm: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: '$bestResult._id',
          date: '$bestResult.date',
          wpm: '$bestResult.wpm',
          accuracy: '$bestResult.accuracy',
          errors: '$bestResult.errors',
          userId: {
            _id: '$user._id',
            username: '$user.username'
          }
        }
      }
    ]);
    res.send(leaderboard);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;