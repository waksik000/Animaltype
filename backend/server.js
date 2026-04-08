require('dotenv').config();
const express = require('express');

const app = express();

app.use(require('cors')({ origin: 'http://localhost:5173' }));
app.use(express.json()); 

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB Atlas')).catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/results', require('./routes/results'));

app.listen(5000, () => { console.log('сервер запущен на 5000 порту'); });