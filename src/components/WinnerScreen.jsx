import Leaderboard from './Leaderboard.jsx';

export default function WinnerScreen({ score, playerName, savedToBoard, onRestart }) {

  return (
    <div className="screen winner">
      <h1 className="winner-title">🏆 YOU WIN! 🏆</h1>
      <p className="winner-subtitle">
        All 3 levels conquered
        {playerName && <>, <span className="winner-player">{playerName}</span></>}
        !
      </p>

      <div className="winner-score-box">
        <span className="winner-score-label">Final Score</span>
        <span className="winner-score-value">{score}</span>
        {savedToBoard && <span className="go-new-record">New record!</span>}
      </div>

      <div className="winner-snake-wrap">
        <FatSnakeSVG />
      </div>

      <Leaderboard
        highlightName={playerName || null}
        highlightScore={score}
      />

      <button className="btn-primary btn-gold" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
}

function FatSnakeSVG() {
  return (
    <svg
      viewBox="0 0 300 180"
      width="300"
      height="180"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fat cheerful snake"
    >
      {/* Tail segments — small to large, right to left */}
      <circle cx="260" cy="130" r="10" fill="#66bb6a" />
      <ellipse cx="258" cy="127" rx="5" ry="3" fill="#81c784" opacity="0.5" />

      <circle cx="232" cy="130" r="14" fill="#66bb6a" />
      <ellipse cx="230" cy="126" rx="6" ry="4" fill="#81c784" opacity="0.5" />

      <circle cx="200" cy="130" r="18" fill="#66bb6a" />
      <ellipse cx="198" cy="125" rx="8" ry="5" fill="#81c784" opacity="0.5" />

      <circle cx="168" cy="118" r="22" fill="#66bb6a" />
      <ellipse cx="165" cy="112" rx="10" ry="6" fill="#81c784" opacity="0.5" />

      <circle cx="138" cy="100" r="26" fill="#66bb6a" />
      <ellipse cx="135" cy="93" rx="12" ry="7" fill="#81c784" opacity="0.5" />

      {/* Head */}
      <circle cx="100" cy="80" r="40" fill="#43a047" />
      <ellipse cx="100" cy="92" rx="22" ry="14" fill="#a5d6a7" opacity="0.7" />

      {/* Left eye */}
      <circle cx="82" cy="65" r="10" fill="white" />
      <circle cx="84" cy="66" r="5" fill="#1a1a1a" />
      <circle cx="86" cy="64" r="2" fill="white" />

      {/* Right eye */}
      <circle cx="116" cy="65" r="10" fill="white" />
      <circle cx="118" cy="66" r="5" fill="#1a1a1a" />
      <circle cx="120" cy="64" r="2" fill="white" />

      {/* Smile */}
      <path
        d="M 85 88 Q 100 100 115 88"
        stroke="#1b5e20"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Forked tongue */}
      <line x1="100" y1="118" x2="100" y2="138" stroke="#e53935" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="138" x2="92" y2="150" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="138" x2="108" y2="150" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round" />

      {/* Scale ellipses on body segments */}
      <ellipse cx="200" cy="136" rx="6" ry="3" fill="#a5d6a7" opacity="0.4" />
      <ellipse cx="168" cy="126" rx="7" ry="3" fill="#a5d6a7" opacity="0.4" />
      <ellipse cx="138" cy="108" rx="8" ry="4" fill="#a5d6a7" opacity="0.4" />

      {/* Stars */}
      <text x="20" y="40" fontSize="18" fill="#facc15">✦</text>
      <text x="265" y="55" fontSize="14" fill="#facc15">✦</text>
      <text x="245" y="100" fontSize="10" fill="#facc15">✦</text>
    </svg>
  );
}
