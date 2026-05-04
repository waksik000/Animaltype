require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const configureSocket = require('./config/socket');

const app = express();

// Middleware
app.use(require('cors')({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Подключение к БД
connectDB();

// Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/results', require('./routes/results'));

// Запуск сервера
const server = app.listen(5000, () => { 
  console.log('сервер запущен на 5000 порту'); 
});

// Настройка Socket.io
configureSocket(server);