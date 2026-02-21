import { LEVELS } from '../utils/levels.js';
import Leaderboard from './Leaderboard.jsx';

export default function GameOver({ score, level, playerName, savedToBoard, onRetryLevel, onRestart }) {
  const config = LEVELS[level] || LEVELS[1];

  return (
    <div className="screen game-over">
      <div className="go-icon">💀</div>
      <h1 className="go-title">Game Over</h1>
      <p className="go-level">
        Died on{' '}
        <span style={{ color: config.color }}>{config.name}</span>
        {playerName && <> · <span className="go-player">{playerName}</span></>}
      </p>

      <div className="go-score-box">
        <span className="go-score-label">Score This Run</span>
        <span className="go-score-value">{score}</span>
        {savedToBoard && <span className="go-new-record">New record!</span>}
      </div>

      <Leaderboard
        highlightName={playerName || null}
        highlightScore={score}
      />

      <div className="go-buttons">
        <button className="btn-primary" onClick={onRetryLevel}>
          Retry {config.name}
        </button>
        <button className="btn-secondary" onClick={onRestart}>
          Main Menu
        </button>
      </div>
    </div>
  );
}
