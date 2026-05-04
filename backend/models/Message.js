const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { 
    type: String, 
    required: true 
  },
  to: { 
    type: String, 
    default: null 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['user', 'admin', 'self'], 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

messageSchema.index({ from: 1, timestamp: -1 });
messageSchema.index({ to: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);