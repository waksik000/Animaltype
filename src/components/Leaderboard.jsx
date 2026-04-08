import React, { useState, useEffect } from 'react';

export default function Leaderboard({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/results/leaderboard')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки лидеров');
        return res.json();
      })
      .then(data => {
        setLeaderboard(data || []);
        setError('');
      })
      .catch(err => {
        console.error('Load leaderboard error:', err);
        setError('Не удалось загрузить таблицу лидеров');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Таблица лидеров</h2>
        {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
        {loading && <p>Загрузка...</p>}
        {!loading && leaderboard.length === 0 && <p>Лидеры пока не найдены</p>}
        {!loading && leaderboard.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Место</th>
              <th>Пользователь</th>
              <th>WPM</th>
              <th>Точность</th>
              <th>Ошибки</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((result, index) => (
              <tr key={result._id}>
                <td>{index + 1}</td>
                <td>{result.userId?.username || '?'}</td>
                <td><strong>{result.wpm}</strong></td>
                <td>{result.accuracy?.toFixed(1)}%</td>
                <td>{result.errors}</td>
                <td>{new Date(result.date).toLocaleDateString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
        <button onClick={onClose} style={{ marginTop: '1rem' }}>Закрыть</button>
      </div>
    </div>
  );
}