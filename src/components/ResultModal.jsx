import React from "react"
export default function ResultModal ({ userWPM,accuracy, errors, handleRestart  }) {
    return (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Results</h2>
            <p>WPM: {Math.round(userWPM)}</p>
            <p>Accuracy: {Math.round(accuracy)}%</p>
            <p>Errors: {errors}</p>

            <button onClick={handleRestart}>Перезапуск</button>
          </div>
        </div>
    )
}