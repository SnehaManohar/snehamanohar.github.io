import { useState } from 'react';
import { LEVELS } from '../utils/levels.js';

const SPEED_OPTIONS = [
  { label: 'Slow', value: 1.6, desc: 'Relaxed pace' },
  { label: 'Normal', value: 1.0, desc: 'Default speed' },
  { label: 'Fast', value: 0.6, desc: 'Challenge mode' },
];

export default function Menu({ onStart }) {
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="screen menu">
      <h1 className="menu-title">🐍 SNAKE</h1>
      <p className="menu-subtitle">Classic snake — three challenging levels</p>

      <div className="level-list">
        {[1, 2, 3].map((lvl) => (
          <div key={lvl} className="level-card">
            <span className="level-badge" style={{ color: LEVELS[lvl].color }}>
              {LEVELS[lvl].name}
            </span>
            <span className="level-desc">{LEVELS[lvl].description}</span>
          </div>
        ))}
      </div>

      <div className="name-input-wrap">
        <label className="name-label" htmlFor="player-name">
          Your name
        </label>
        <input
          id="player-name"
          className="name-input"
          type="text"
          placeholder="Leave blank to play anonymously"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={20}
          autoComplete="off"
        />
        {!playerName.trim() && (
          <span className="name-hint">Scores won't be saved without a name</span>
        )}
      </div>

      <div className="speed-selector">
        <span className="speed-label">Speed</span>
        <div className="speed-options">
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`speed-btn${selectedSpeed === opt.value ? ' speed-btn--active' : ''}`}
              onClick={() => setSelectedSpeed(opt.value)}
              title={opt.desc}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={() => onStart(selectedSpeed, playerName.trim())}>
        Start Game
      </button>

      <div className="controls-hint">
        <span>Arrow keys / WASD — or swipe / D-pad on mobile</span>
        <span>Eat 15 pellets to advance · boundary wraps</span>
      </div>
    </div>
  );
}
