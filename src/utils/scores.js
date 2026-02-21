const STORAGE_KEY = 'snake_top_scores';
const MAX_SCORES = 5;

export function getScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// Saves score for a named player.
// Returns true if the entry made it into the top 5.
export function saveScore(name, score) {
  const before = getScores();
  const qualifies = before.length < MAX_SCORES || score > before[before.length - 1].score;
  if (!qualifies) return false;

  const updated = [...before, { name, score, date: new Date().toLocaleDateString() }];
  updated.sort((a, b) => b.score - a.score);
  const top = updated.slice(0, MAX_SCORES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
  } catch {
    // localStorage unavailable — ignore
  }
  return true;
}
