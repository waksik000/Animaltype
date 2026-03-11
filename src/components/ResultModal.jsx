import React from "react"
export default function ResultModal ({ userWPM,accuracy, errors, handleRestart, setShowHistory  }) {
    return (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Results</h2>
            <p>WPM: {Math.round(userWPM)}</p>
            <p>Accuracy: {Math.round(accuracy)}%</p>
            <p>Errors: {errors}</p>

            <button onClick={handleRestart}>Перезапуск</button>
            <button onClick={() => {setShowHistory(true)}}>Показать историю</button>
          </div>
        </div>
    )
}