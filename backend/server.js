require('dotenv').config();
const express = require('express');

const app = express();

app.use(require('cors')());
app.use(express.json());  // Это должно быть ДО маршрутов

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB Atlas')).catch(err => console.error('MongoDB connection error:', err));

app.use('/api/results', require('./routes/results'));  // Маршруты ПОСЛЕ middleware

app.listen(5000, () => { console.log('сервер запущен на 5000 порту'); });