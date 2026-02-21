import { PELLETS_TO_ADVANCE, LEVELS } from '../utils/levels.js';

export default function HUD({ level, pellets, score }) {
  const config = LEVELS[level];
  return (
    <div className="hud">
      <div className="hud-item">
        <span className="hud-label">Level</span>
        <span className="hud-value" style={{ color: config.color }}>{config.name}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Pellets</span>
        <span className="hud-value">
          {pellets}
          <span className="hud-dim">/{PELLETS_TO_ADVANCE}</span>
        </span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Score</span>
        <span className="hud-value hud-score">{score}</span>
      </div>
    </div>
  );
}
