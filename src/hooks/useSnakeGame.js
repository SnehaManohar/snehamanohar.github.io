import { useCallback, useEffect, useRef, useState } from 'react';
import { GRID_SIZE, PELLETS_TO_ADVANCE, LEVELS } from '../utils/levels.js';

function randomFood(snake, allObs) {
  const occupied = new Set();
  for (const s of snake) occupied.add(`${s.x},${s.y}`);
  for (const o of allObs) occupied.add(`${o.x},${o.y}`);

  let pos;
  let attempts = 0;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    attempts++;
    if (attempts > 1000) break;
  } while (occupied.has(`${pos.x},${pos.y}`));
  return pos;
}

function initGameState(level) {
  const config = LEVELS[level];
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  const movingObstacles = config.movingObstacles.map((o) => ({ ...o }));
  const allObs = [
    ...config.staticObstacles,
    ...movingObstacles,
  ];
  const food = randomFood(snake, allObs);
  return {
    snake,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food,
    movingObstacles,
    pellets: 0,
    score: 0,
    tickCount: 0,
    done: false,
  };
}

export default function useSnakeGame({ level, speedMultiplier, onLevelComplete, onGameOver }) {
  const config = LEVELS[level];
  const gs = useRef(null);
  const [frame, setFrame] = useState(0);

  const onLevelCompleteRef = useRef(onLevelComplete);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onLevelCompleteRef.current = onLevelComplete;
  }, [onLevelComplete]);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  // Initialize state (reset on level/key change)
  if (gs.current === null) {
    gs.current = initGameState(level);
  }

  // Stable direction setter — consumed by keyboard, swipe, and D-pad
  const handleDirection = useCallback((newDir) => {
    const state = gs.current;
    if (!state || state.done) return;
    const cur = state.dir;
    if (newDir.x === -cur.x && newDir.y === -cur.y) return;
    state.nextDir = newDir;
  }, []); // gs ref is stable across renders

  // Keyboard handler
  useEffect(() => {
    const keyMap = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
      W: { x: 0, y: -1 },
      S: { x: 0, y: 1 },
      A: { x: -1, y: 0 },
      D: { x: 1, y: 0 },
    };

    function handleKey(e) {
      const newDir = keyMap[e.key];
      if (!newDir) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      handleDirection(newDir);
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleDirection]);

  // Swipe gesture handler (touch devices)
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    function onTouchStart(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        handleDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
      } else {
        handleDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleDirection]);

  // Game loop
  useEffect(() => {
    const intervalMs = Math.round(config.speed * speedMultiplier);

    const intervalId = setInterval(() => {
      const state = gs.current;
      if (!state || state.done) return;

      // 1. Increment tick
      state.tickCount += 1;

      // 2. Apply nextDir
      state.dir = { ...state.nextDir };

      const staticObs = config.staticObstacles;

      // 3. Move moving obstacles every 3 ticks
      if (state.tickCount % 3 === 0) {
        for (const mo of state.movingObstacles) {
          const nx = mo.x + mo.dx;
          const ny = mo.y + mo.dy;

          const wallBounceX = nx < 0 || nx >= GRID_SIZE;
          const wallBounceY = ny < 0 || ny >= GRID_SIZE;
          const hitStatic = staticObs.some((s) => s.x === nx && s.y === ny);

          if (wallBounceX || wallBounceY || hitStatic) {
            if (wallBounceX || (hitStatic && mo.dx !== 0)) mo.dx = -mo.dx;
            if (wallBounceY || (hitStatic && mo.dy !== 0)) mo.dy = -mo.dy;
          } else {
            mo.x = nx;
            mo.y = ny;
          }
        }
      }

      // 4. Compute new head — boundary wraps instead of killing
      const head = state.snake[0];
      const newHead = {
        x: ((head.x + state.dir.x) + GRID_SIZE) % GRID_SIZE,
        y: ((head.y + state.dir.y) + GRID_SIZE) % GRID_SIZE,
      };

      // 6. Self collision (all levels)
      for (const seg of state.snake) {
        if (seg.x === newHead.x && seg.y === newHead.y) {
          state.done = true;
          setFrame((f) => f + 1);
          onGameOverRef.current(state.score);
          return;
        }
      }

      // 7. Static obstacle collision (levels 2 and 3)
      if (level >= 2) {
        for (const obs of staticObs) {
          if (obs.x === newHead.x && obs.y === newHead.y) {
            state.done = true;
            setFrame((f) => f + 1);
            onGameOverRef.current(state.score);
            return;
          }
        }
      }

      // 8. Moving obstacle collision — new head hits a moving obstacle (level 3)
      // Also check if a moving obstacle runs into any existing snake segment
      if (level >= 3) {
        for (const mo of state.movingObstacles) {
          // New head enters a moving obstacle's cell
          if (mo.x === newHead.x && mo.y === newHead.y) {
            state.done = true;
            setFrame((f) => f + 1);
            onGameOverRef.current(state.score);
            return;
          }
          // Moving obstacle moves into an existing snake segment
          for (const seg of state.snake) {
            if (mo.x === seg.x && mo.y === seg.y) {
              state.done = true;
              setFrame((f) => f + 1);
              onGameOverRef.current(state.score);
              return;
            }
          }
        }
      }

      // 9. Food check
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        state.snake = [newHead, ...state.snake];
        state.pellets += 1;

        const scoreMap = { 1: 10, 2: 20, 3: 30 };
        state.score += scoreMap[level] || 10;

        if (state.pellets >= PELLETS_TO_ADVANCE) {
          state.done = true;
          setFrame((f) => f + 1);
          onLevelCompleteRef.current(state.score);
          return;
        }

        const newAllObs = [...staticObs, ...state.movingObstacles];
        state.food = randomFood(state.snake, newAllObs);
      } else {
        state.snake = [newHead, ...state.snake.slice(0, state.snake.length - 1)];
      }

      setFrame((f) => f + 1);
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [level, config.speed, speedMultiplier]);

  const state = gs.current || initGameState(level);

  return {
    snake: state.snake,
    food: state.food,
    staticObstacles: config.staticObstacles,
    movingObstacles: state.movingObstacles,
    pellets: state.pellets,
    score: state.score,
    handleDirection,
  };
}
