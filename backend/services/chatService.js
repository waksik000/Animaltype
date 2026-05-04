const Message = require('../models/Message');

class ChatService {
  // новое сообщение в бд
  static async addMessage(msgData) {
    try {
      const message = new Message(msgData);
      await message.save();
      return message;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  // получить мсоообщение
  static async getUserMessages(username) {
    try {
      return await Message.find({
        $or: [
          { from: username },
          { to: username },
          { type: 'admin', to: username }
        ]
      }).sort({ timestamp: 1 });
    } catch (error) {
      console.error('Error getting user messages:', error);
      return [];
    }
  }

  // сообщения для админа
  static async getAllMessages() {
    try {
      return await Message.find().sort({ timestamp: 1 });
    } catch (error) {
      console.error('Error getting all messages:', error);
      return [];
    }
  }
}

module.exports = ChatService;