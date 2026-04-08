import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

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
      setMessages(prev => [...prev, { ...msg, type: 'user' }]);
    });

    socketRef.current.on('admin message', (msg) => {
      setMessages(prev => [...prev, { ...msg, type: 'admin' }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit('support message', message);
    setMessages(prev => [...prev, { from: 'Вы', message, type: 'self', timestamp: new Date() }]); // Показать своё сообщение
    setMessage('');
  };

  const startReply = (to) => {
    console.log('startReply called with:', to);
    setReplyTo(to);
  };

  const sendReply = () => {
    if (!replyMessage.trim()) return;
    socketRef.current.emit('admin reply', { to: replyTo, message: replyMessage });
    // Не добавляем локально, сервер emit всем
    setReplyTo(null);
    setReplyMessage('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: '500px', height: '600px', display: 'flex', flexDirection: 'column' }}>
        <h2>{isAdmin ? 'Админ: Чат поддержки' : 'Чат поддержки'}</h2>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', padding: '1rem', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: msg.type === 'admin' ? '#2a4d69' : msg.type === 'self' ? '#4a6d4a' : '#4a4a4a', borderRadius: '4px' }}>
              <strong>{msg.from} {msg.to ? `-> ${msg.to}` : ''}:</strong> {msg.message}
              <br />
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              {isAdmin && msg.type === 'user' && (
                <button onClick={() => startReply(msg.from)} style={{ marginLeft: '1rem', fontSize: '0.8rem' }}>
                  Ответить
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {replyTo && (
          <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#2a2a2a', borderRadius: '4px' }}>
            <p>Ответить {replyTo}:</p>
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendReply()}
              placeholder="Введите ответ..."
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
            <button onClick={sendReply}>Отправить ответ</button>
            <button onClick={() => setReplyTo(null)} style={{ marginLeft: '0.5rem' }}>Отмена</button>
          </div>
        )}
        {!isAdmin && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Введите сообщение..."
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <button onClick={sendMessage}>Отправить</button>
          </div>
        )}
        <button onClick={onClose} style={{ marginTop: '1rem' }}>Закрыть</button>
      </div>
    </div>
  );
}