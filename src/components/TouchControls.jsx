const DIRS = {
  up:    { x: 0, y: -1 },
  down:  { x: 0, y:  1 },
  left:  { x: -1, y: 0 },
  right: { x:  1, y: 0 },
};

export default function TouchControls({ onDirection }) {
  function tap(dir) {
    return (e) => {
      e.preventDefault();
      onDirection(DIRS[dir]);
    };
  }

  return (
    <div className="dpad" aria-label="Directional controls">
      <button
        className="dpad-btn dpad-up"
        onPointerDown={tap('up')}
        aria-label="Up"
      >▲</button>
      <button
        className="dpad-btn dpad-left"
        onPointerDown={tap('left')}
        aria-label="Left"
      >◀</button>
      <div className="dpad-center" aria-hidden="true" />
      <button
        className="dpad-btn dpad-right"
        onPointerDown={tap('right')}
        aria-label="Right"
      >▶</button>
      <button
        className="dpad-btn dpad-down"
        onPointerDown={tap('down')}
        aria-label="Down"
      >▼</button>
    </div>
  );
}
