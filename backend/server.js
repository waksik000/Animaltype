require('dotenv').config();
const express = require('express');

const app = express();

app.use(require('cors')({ origin: 'http://localhost:5173' }));
app.use(express.json()); 

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB Atlas')).catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/results', require('./routes/results'));

const server = app.listen(5000, () => { console.log('сервер запущен на 5000 порту'); });

// Socket.io для чата поддержки
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Хранилище сообщений (в памяти, для демо)
let supportMessages = [];

// Аутентификация для Socket.io
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Socket auth decoded:', decoded);
    socket.user = decoded;
    socket.user.username = decoded.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.username, 'role:', socket.user.role);

  // Присоединиться к комнате поддержки (все видят ответы админа)
  socket.join('support');

  // Отправить историю сообщений
  const history = socket.user.role === 'admin' 
    ? supportMessages // Админ видит все
    : supportMessages.filter(msg => msg.from === socket.user.username || msg.to === socket.user.username || msg.type === 'admin'); // Пользователь видит свои и ответы
  socket.emit('chat history', history);

  // Слушать сообщения от пользователей (не админов)
  socket.on('support message', (message) => {
    if (socket.user.role !== 'admin') {
      console.log('Support message from:', socket.user.username, 'message:', message);
      const msg = {
        from: socket.user.username,
        message,
        timestamp: new Date(),
        type: 'user'
      };
      supportMessages.push(msg);
      // Отправить всем админам
      io.to('admins').emit('new support message', msg);
    }
  });

  // Админ отвечает пользователю
  socket.on('admin reply', (data) => {
    if (socket.user.role === 'admin') {
      const msg = {
        to: data.to,
        message: data.message,
        from: 'Admin',
        timestamp: new Date(),
        type: 'admin'
      };
      supportMessages.push(msg);
      io.to('support').emit('admin message', msg);
    }
  });

  // Если админ, присоединить к комнате админов
  if (socket.user.role === 'admin') {
    socket.join('admins');
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.username);
  });
});