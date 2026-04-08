import React from "react"
export default function ResultModal ({ userWPM, accuracy, errors, handleRestart, setShowHistory, isLoggedIn  }) {
    return (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Результаты</h2>
            <div className="results-stats">
              <p><strong>Скорость (WPM):</strong> {Math.round(userWPM)}</p>
              <p><strong>Точность:</strong> {Math.round(accuracy)}%</p>
              <p><strong>Ошибок:</strong> {errors}</p>
            </div>

            <div className="buttons-group">
              <button onClick={handleRestart}>Попробовать снова</button>
              {isLoggedIn && <button onClick={() => setShowHistory(true)}>История попыток</button>}
            </div>
          </div>
        </div>
    )
}