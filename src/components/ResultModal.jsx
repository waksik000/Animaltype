import React, { useEffect, useState } from "react";
import RankBadge from "./RankBadge";

export default function ResultModal({ 
  userWPM, 
  accuracy, 
  errors, 
  handleRestart, 
  setShowHistory, 
  isLoggedIn 
}) {
  const wpm = Math.round(userWPM);
  const [showRank, setShowRank] = useState(false);
  
  // Анимация
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRank(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Результаты</h2>
        
        <div className="results-stats">
          <p><strong>Скорость (WPM):</strong> {wpm}</p>
          <p><strong>Точность:</strong> {Math.round(accuracy)}%</p>
          <p><strong>Ошибок:</strong> {errors}</p>
        </div>

        <div className={`rank-wrapper ${showRank ? 'visible' : 'hidden'}`}>
          <RankBadge wpm={wpm} />
        </div>

        <div className="buttons-group">
          <button onClick={handleRestart}>Попробовать снова</button>
          {isLoggedIn && (
            <button onClick={() => setShowHistory(true)}>
              История попыток
            </button>
          )}
        </div>
      </div>
    </div>
  );
}