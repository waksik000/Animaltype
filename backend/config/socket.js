const socketIo = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const setupChatHandlers = require('../socket/chatHandlers');

const configureSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  // middleware ауентитификации
  io.use(socketAuth);

  // обработчики
  io.on('connection', (socket) => {
    setupChatHandlers(io, socket);
  });

  return io;
};

module.exports = configureSocket;