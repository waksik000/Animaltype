import React, { useState, useEffect } from "react";

export default function HistoryModal ({onClose}) {
    
    const [history, setHistory] = useState([]);  // Состояние для хранения истории из API
    useEffect(() => {
        // Загружаем историю с сервера при открытии модала
        fetch('http://localhost:5000/api/results')  // GET-запрос на сервер
            .then(res => res.json())  // Преобразуем ответ в JSON
            .then(data => setHistory(data))  // Сохраняем данные в состояние
            .catch(err => console.error('Load error:', err));  // Обрабатываем ошибки
    }, []);  // Пустой массив зависимостей — эффект запускается один раз при монтировании
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>История попыток</h2>
                {history.length === 0 ? (<p>Нет сохраненных попыток</p>) : (
                    <ul>
                        {history.map((attemp, index) => {
                            const date = new Date(attemp.date)
                            const formattedDate = date.toLocaleString()
                        
                            
                            return (<li key={index}>
                                <strong>{formattedDate}</strong>    WPM: {attemp.wpm || 'N/A'}, Accuracy: {attemp.accuracy ? attemp.accuracy.toFixed(1) : 'N/A'}%, Errors: {attemp.errors || 'N/A'}
                            </li>
                        )
})}
                    </ul>
                )}


                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    )
}