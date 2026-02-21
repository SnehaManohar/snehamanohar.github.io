import { useState, useEffect } from 'react';
import { GRID_SIZE } from '../utils/levels.js';

const MAX_CELL_SIZE = 28;
const H_PADDING = 32; // 16px each side

function computeCellSize() {
  const available = Math.min(window.innerWidth - H_PADDING, 560);
  return Math.min(MAX_CELL_SIZE, Math.max(14, Math.floor(available / GRID_SIZE)));
}

export default function useCanvasSize() {
  const [cellSize, setCellSize] = useState(computeCellSize);

  useEffect(() => {
    function onResize() {
      setCellSize(computeCellSize());
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return { cellSize, canvasSize: cellSize * GRID_SIZE };
}
