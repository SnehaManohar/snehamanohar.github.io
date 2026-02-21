import { useEffect, useRef } from 'react';
import { CELL_SIZE as DEFAULT_CELL_SIZE, GRID_SIZE } from '../utils/levels.js';

function fillRoundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

export default function GameBoard({ snake, food, staticObstacles, movingObstacles, level, cellSize: cellSizeProp }) {
  const cellSize = cellSizeProp ?? DEFAULT_CELL_SIZE;
  const CANVAS_SIZE = GRID_SIZE * cellSize;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid lines
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(CANVAS_SIZE, i * cellSize);
      ctx.stroke();
    }

    const pad = 2;
    const inner = cellSize - pad * 2;

    // Static obstacles — dark slate
    ctx.fillStyle = '#334155';
    for (const obs of staticObstacles) {
      fillRoundRect(
        ctx,
        obs.x * cellSize + pad,
        obs.y * cellSize + pad,
        inner,
        inner,
        4
      );
    }

    // Moving obstacles — orange-red
    for (const obs of movingObstacles) {
      ctx.fillStyle = '#ef4444';
      fillRoundRect(
        ctx,
        obs.x * cellSize + pad,
        obs.y * cellSize + pad,
        inner,
        inner,
        5
      );
      // Inner highlight
      ctx.fillStyle = '#f97316';
      fillRoundRect(
        ctx,
        obs.x * cellSize + pad + 4,
        obs.y * cellSize + pad + 4,
        inner - 8,
        inner - 8,
        3
      );
    }

    // Food — radial gradient glowing dot
    if (food) {
      const cx = food.x * cellSize + cellSize / 2;
      const cy = food.y * cellSize + cellSize / 2;
      const r = cellSize / 2 - 3;

      // Outer glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r + 6);
      glow.addColorStop(0, 'rgba(250, 204, 21, 0.4)');
      glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
      ctx.fill();

      // Main dot
      const grad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, r);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#facc15');
      grad.addColorStop(1, '#f97316');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Snake body — green rounded rects with fading alpha
    const snakeLen = snake.length;
    for (let i = snakeLen - 1; i >= 1; i--) {
      const seg = snake[i];
      const alpha = 0.35 + 0.55 * (1 - i / snakeLen);
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      fillRoundRect(
        ctx,
        seg.x * cellSize + pad,
        seg.y * cellSize + pad,
        inner,
        inner,
        5
      );
    }

    // Snake head — bright green, slightly larger radius
    if (snake.length > 0) {
      const head = snake[0];
      ctx.fillStyle = '#4ade80';
      fillRoundRect(
        ctx,
        head.x * cellSize + pad - 1,
        head.y * cellSize + pad - 1,
        inner + 2,
        inner + 2,
        7
      );
      // Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      fillRoundRect(
        ctx,
        head.x * cellSize + pad + 2,
        head.y * cellSize + pad + 2,
        inner / 2,
        inner / 2 - 2,
        4
      );
    }
  }, [snake, food, staticObstacles, movingObstacles, level, cellSize, CANVAS_SIZE]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      style={{
        display: 'block',
        border: '2px solid #1e293b',
        borderRadius: '4px',
        boxShadow: '0 0 32px rgba(74, 222, 128, 0.15)',
        touchAction: 'none',
      }}
    />
  );
}
