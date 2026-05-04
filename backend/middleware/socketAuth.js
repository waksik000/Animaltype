const jwt = require('jsonwebtoken');

const socketAuth = async (socket, next) => {
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
};

module.exports = socketAuth;