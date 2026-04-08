import React, { useState } from 'react';

export default function AuthModal({ onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем ошибку перед отправкой
    const endpoint = isRegister ? 'register' : 'login';
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (!isRegister) {
          localStorage.setItem('token', data.token);
          onLogin();
        }
        setUsername('');
        setPassword('');
        onClose();
      } else {
        // Ошибки на русском
        const errorMessages = {
          'Invalid username or password': 'Неверное имя пользователя или пароль',
          'User not found': 'Пользователь не найден',
          'User already exists': 'Пользователь уже существует',
          'Username and password are required': 'Имя пользователя и пароль обязательны'
        };
        setError(errorMessages[data.error] || data.error || 'Ошибка при выполнении запроса');
      }
    } catch (err) {
      setError('Ошибка сети. Проверьте соединение');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isRegister ? 'Регистрация' : 'Логин'}</h2>
        {error && <p style={{ color: '#ff6b6b', fontSize: '0.95rem', marginBottom: '1rem', backgroundColor: '#2a1a1a', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ff6b6b' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            required
          />
          <button type="submit">{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
        </form>
        <div className="buttons-group">
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}