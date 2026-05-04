const ChatService = require('../services/chatService');

const setupChatHandlers = (io, socket) => {
  console.log('User connected:', socket.user.username, 'role:', socket.user.role);

  // история
  handleConnection(io, socket);

  // обработка сообщения
  socket.on('support message', (message) => handleUserMessage(io, socket, message));
  socket.on('admin reply', (data) => handleAdminReply(io, socket, data));
  socket.on('disconnect', () => handleDisconnect(socket));
};

//подключение
const handleConnection = async (io, socket) => {
  try {
    if (socket.user.role === 'admin') {
      socket.join('admins');
      const allMessages = await ChatService.getAllMessages();
      socket.emit('chat history', allMessages);
    } else {
      socket.join(`user_${socket.user.username}`);
      const userMessages = await ChatService.getUserMessages(socket.user.username);
      socket.emit('chat history', userMessages);
    }
  } catch (error) {
    console.error('Connection error:', error);
  }
};

// сообщ от пользователдя
const handleUserMessage = async (io, socket, message) => {
  if (socket.user.role !== 'admin' && message.trim()) {
    try {
      const msg = await ChatService.addMessage({
        from: socket.user.username,
        message: message.trim(),
        type: 'user'
      });

      // к пользователю
      io.to(`user_${socket.user.username}`).emit('new support message', msg);
      // к админам
      io.to('admins').emit('new support message', msg);
    } catch (error) {
      console.error('Error handling user message:', error);
    }
  }
};

// ответ админа
const handleAdminReply = async (io, socket, data) => {
  if (socket.user.role === 'admin' && data.message.trim() && data.to) {
    try {
      const msg = await ChatService.addMessage({
        from: 'Admin',
        to: data.to,
        message: data.message.trim(),
        type: 'admin'
      });

      // отправить пользователю
      io.to(`user_${data.to}`).emit('admin message', msg);
      // отправить админам
      io.to('admins').emit('admin message', msg);
    } catch (error) {
      console.error('Error handling admin reply:', error);
    }
  }
};

// отключение
const handleDisconnect = (socket) => {
  console.log('User disconnected:', socket.user.username);
};

module.exports = setupChatHandlers;