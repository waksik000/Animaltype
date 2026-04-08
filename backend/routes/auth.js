const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Валидация
    if (!username || !password) {
      return res.status(400).send({ error: 'Имя пользователя и пароль обязательны' });
    }
    if (password.length < 4) {
      return res.status(400).send({ error: 'Пароль должен быть минимум 4 символа' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).send({ error: 'Это имя пользователя уже занято' });
    } else {
      res.status(400).send({ error: error.message });
    }
  }
});

// Логин пользователя
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).send({ error: 'Имя пользователя и пароль обязательны' });
    }
    
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send({ error: 'Неверное имя пользователя или пароль' });
    }
    // Для демонстрации: если username 'admin', сделать админом
    if (username === 'admin') {
      user.role = 'admin';
      await user.save();
    }
    const token = jwt.sign({ userId: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET); // Используем переменную окружения
    console.log('Generated token for:', username, 'payload:', { userId: user._id, role: user.role, username: user.username });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;