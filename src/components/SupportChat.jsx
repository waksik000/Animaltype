import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from './SupportChat.module.css';

export default function SupportChat({ onClose, isAdmin }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    socketRef.current = io('http://localhost:5000', {
      auth: { token }
    });

    socketRef.current.on('chat history', (history) => {
      setMessages(history);
    });

    socketRef.current.on('new support message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('admin message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit('support message', message.trim());
    setMessage('');
  };

  const startReply = (to) => {
    setReplyTo(to);
  };

  const sendReply = () => {
    if (!replyMessage.trim() || !replyTo) return;
    
    socketRef.current.emit('admin reply', { 
      to: replyTo, 
      message: replyMessage.trim() 
    });
    
    setReplyTo(null);
    setReplyMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStyle = (type) => {
    switch (type) {
      case 'admin': return styles.messageAdmin;
      case 'self': return styles.messageSelf;
      default: return styles.messageUser;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.header}>
          {isAdmin ? 'Админ: Чат поддержки' : 'Чат поддержки'}
        </h2>
        
        <div className={styles.messagesContainer}>
          {messages.length === 0 && (
            <p className={styles.emptyState}>
              {isAdmin ? 'Нет обращений от пользователей' : 'Напишите ваш вопрос, и администратор ответит вам'}
            </p>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${getMessageStyle(msg.type)}`}>
              <div className={styles.messageHeader}>
                <strong className={styles.messageSender}>
                  {msg.from} {msg.to ? `→ ${msg.to}` : ''}
                </strong>
                <small className={styles.messageTime}>
                  {formatTime(msg.timestamp)}
                </small>
              </div>
              <div className={styles.messageText}>{msg.message}</div>
              
              {isAdmin && msg.type === 'user' && (
                <button 
                  onClick={() => startReply(msg.from)} 
                  className={styles.replyButton}
                >
                  Ответить
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {replyTo && (
          <div className={styles.replyContainer}>
            <p className={styles.replyLabel}>
              Ответ для: <span className={styles.replyUsername}>{replyTo}</span>
            </p>
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendReply()}
              placeholder="Введите ответ..."
              className={styles.replyInput}
              autoFocus
            />
            <div className={styles.replyActions}>
              <button onClick={sendReply} className={styles.sendButton}>
                Отправить
              </button>
              <button onClick={() => setReplyTo(null)} className={styles.cancelButton}>
                Отмена
              </button>
            </div>
          </div>
        )}

        {!isAdmin && (
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Введите сообщение..."
              className={styles.messageInput}
            />
            <button onClick={sendMessage} className={styles.sendMessageButton}>
              Отправить
            </button>
          </div>
        )}

        <button onClick={onClose} className={styles.closeButton}>
          Закрыть
        </button>
      </div>
    </div>
  );
}