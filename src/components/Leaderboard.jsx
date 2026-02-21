import { getScores } from '../utils/scores.js';

const MEDALS = ['🥇', '🥈', '🥉'];

// highlightName + highlightScore: marks rows that belong to the current run.
// Pass null/undefined to highlight nothing (anonymous players).
export default function Leaderboard({ highlightName, highlightScore }) {
  const scores = getScores();

  return (
    <div className="leaderboard">
      <h3 className="lb-title">Top Scores</h3>
      {scores.length === 0 ? (
        <p className="lb-empty">No scores yet — be the first!</p>
      ) : (
        <ul className="lb-list">
          {scores.map((entry, i) => {
            const isMe =
              highlightName &&
              entry.name === highlightName &&
              entry.score === highlightScore;
            return (
              <li key={i} className={`lb-entry${isMe ? ' lb-entry--me' : ''}`}>
                <span className="lb-rank">
                  {MEDALS[i] ?? `#${i + 1}`}
                </span>
                <span className="lb-name">{entry.name}</span>
                <span className="lb-score">{entry.score}</span>
                {isMe && <span className="lb-you">you</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
