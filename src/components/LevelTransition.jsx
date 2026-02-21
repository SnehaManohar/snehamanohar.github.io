import { useEffect } from 'react';
import { LEVELS } from '../utils/levels.js';

export default function LevelTransition({ level, score, onContinue }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  const completedLevel = level - 1;
  const config = LEVELS[completedLevel] || LEVELS[1];

  return (
    <div className="screen transition">
      <div className="transition-badge" style={{ color: config.color }}>
        Level {completedLevel} Complete!
      </div>
      <h2 className="transition-heading">Well done!</h2>
      <p className="transition-score">Score so far: <strong>{score}</strong></p>
      <p className="transition-next">
        Get ready for{' '}
        <span style={{ color: LEVELS[level]?.color || '#fff' }}>
          {LEVELS[level]?.name || 'the next level'}
        </span>
        ...
      </p>
      <div className="transition-bar">
        <div className="transition-bar-fill" />
      </div>
    </div>
  );
}
