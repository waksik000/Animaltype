import React from "react";

export default function HistoryModal ({history, onClose}) {
    
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
                                <strong>{formattedDate}</strong>    WPM: {attemp.wpm}, Accuracy: {attemp.accuracy.toFixed(1)}%, Errors: {attemp.errors}
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