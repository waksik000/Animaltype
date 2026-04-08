import React, { useState, useEffect } from "react";

export default function HistoryModal ({onClose}) {
    
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/results', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
              if (!res.ok) throw new Error('Ошибка загрузки истории');
              return res.json();
            })
            .then(data => {
              setHistory(Array.isArray(data) ? data.reverse() : []);
              setError('');
            })
            .catch(err => {
              console.error('Load error:', err);
              setError('Не удалось загрузить историю');
            })
            .finally(() => setLoading(false));
    }, []);
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>История попыток</h2>
                {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
                {loading && <p>Загрузка...</p>}
                {!loading && history.length === 0 && <p>Нет сохранённых попыток</p>}
                {!loading && history.length > 0 && (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <table>
                        <tbody>
                          {history.map((attempt, index) => {
                            const date = new Date(attempt.date).toLocaleString('ru-RU');
                            return (
                              <tr key={attempt._id || index}>
                                <td style={{borderBottom: '1px solid #444', padding: '0.5rem', color: '#ccc'}}>
                                  <strong>{date}</strong><br/>
                                  WPM: {attempt.wpm ?? 'N/A'} | Точность: {attempt.accuracy != null ? attempt.accuracy.toFixed(1) : 'N/A'}% | Ошибок: {attempt.errors ?? 'N/A'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                )}
                <button onClick={onClose} style={{ marginTop: '1rem' }}>Закрыть</button>
            </div>
        </div>
    )
}