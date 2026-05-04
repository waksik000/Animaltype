import React from 'react';
import { getAnimalRank, getNextRank, getRankProgress } from '../utils/animalRank';
import styles from './RankBadge.module.css';

export default function RankBadge({ wpm }) {
  const rank = getAnimalRank(wpm);
  const nextRank = getNextRank(wpm);
  const progress = getRankProgress(wpm);
  
  if (!rank) return null;

  return (
    <div className={styles.rankContainer}>
      <div className={styles.rankBadge} style={{ borderColor: rank.color }}>
        <div className={styles.rankEmoji}>{rank.emoji}</div>
        <div className={styles.rankInfo}>
          <h3 className={styles.rankTitle} style={{ color: rank.color }}>
            {rank.animal} — {rank.title}
          </h3>
          <p className={styles.rankDescription}>{rank.description}</p>
        </div>
      </div>
      
      {nextRank && (
        <div className={styles.progressSection}>
          <p className={styles.progressText}>
            До следующего ранга: <strong>{nextRank.animal} {nextRank.emoji}</strong> — нужно {nextRank.minWpm} WPM
          </p>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${progress}%`,
                backgroundColor: rank.color 
              }}
            />
          </div>
          <p className={styles.progressPercentage}>
            {wpm} / {nextRank.minWpm} WPM ({progress}%)
          </p>
        </div>
      )}
      
      {!nextRank && (
        <div className={styles.maxRank}>
          <p>🏆 Поздравляем! Ты достиг максимального ранга!</p>
        </div>
      )}
    </div>
  );
}