import { useState, useCallback } from 'react';
import GameBoard from './components/GameBoard.jsx';
import HUD from './components/HUD.jsx';
import Menu from './components/Menu.jsx';
import LevelTransition from './components/LevelTransition.jsx';
import GameOver from './components/GameOver.jsx';
import WinnerScreen from './components/WinnerScreen.jsx';
import TouchControls from './components/TouchControls.jsx';
import useSnakeGame from './hooks/useSnakeGame.js';
import useCanvasSize from './hooks/useCanvasSize.js';
import { saveScore } from './utils/scores.js';

function GameScreen({ level, speedMultiplier, totalScore, onLevelComplete, onGameOver }) {
  const { snake, food, staticObstacles, movingObstacles, pellets, score, handleDirection } =
    useSnakeGame({ level, speedMultiplier, onLevelComplete, onGameOver });
  const { cellSize, canvasSize } = useCanvasSize();

  return (
    <div className="game-container" style={{ width: canvasSize }}>
      <HUD level={level} pellets={pellets} score={totalScore + score} />
      <GameBoard
        snake={snake}
        food={food}
        staticObstacles={staticObstacles}
        movingObstacles={movingObstacles}
        level={level}
        cellSize={cellSize}
      />
      <TouchControls onDirection={handleDirection} />
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [lastLevelScore, setLastLevelScore] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [playerName, setPlayerName] = useState('');
  const [gameKey, setGameKey] = useState(0);
  const [savedToBoard, setSavedToBoard] = useState(false);

  const handleStart = useCallback((selectedSpeed, name) => {
    setPlayerName(name);
    setSpeedMultiplier(selectedSpeed);
    setLevel(1);
    setTotalScore(0);
    setLastLevelScore(0);
    setSavedToBoard(false);
    setGameKey((k) => k + 1);
    setScreen('playing');
  }, []);

  const handleLevelComplete = useCallback(
    (levelScore) => {
      const newTotal = totalScore + levelScore;
      setLastLevelScore(levelScore);
      setTotalScore(newTotal);
      if (level >= 3) {
        const qualified = playerName ? saveScore(playerName, newTotal) : false;
        setSavedToBoard(qualified);
        setScreen('winner');
      } else {
        setLevel((prev) => prev + 1);
        setScreen('transition');
      }
    },
    [level, totalScore, playerName]
  );

  const handleGameOver = useCallback(
    (levelScore) => {
      const finalScore = totalScore + levelScore;
      setLastLevelScore(levelScore);
      setTotalScore(finalScore);
      const qualified = playerName ? saveScore(playerName, finalScore) : false;
      setSavedToBoard(qualified);
      setScreen('gameover');
    },
    [totalScore, playerName]
  );

  const handleRetryLevel = useCallback(() => {
    setTotalScore((prev) => prev - lastLevelScore);
    setLastLevelScore(0);
    setGameKey((k) => k + 1);
    setScreen('playing');
  }, [lastLevelScore]);

  const handleRestart = useCallback(() => {
    setLevel(1);
    setTotalScore(0);
    setLastLevelScore(0);
    setGameKey((k) => k + 1);
    setScreen('menu');
  }, []);

  const handleContinue = useCallback(() => {
    setGameKey((k) => k + 1);
    setScreen('playing');
  }, []);

  if (screen === 'menu') {
    return (
      <div className="app">
        <Menu onStart={handleStart} />
      </div>
    );
  }

  if (screen === 'playing') {
    return (
      <div className="app">
        <GameScreen
          key={`${level}-${gameKey}`}
          level={level}
          speedMultiplier={speedMultiplier}
          totalScore={totalScore}
          onLevelComplete={handleLevelComplete}
          onGameOver={handleGameOver}
        />
      </div>
    );
  }

  if (screen === 'transition') {
    return (
      <div className="app">
        <LevelTransition
          level={level}
          score={totalScore}
          onContinue={handleContinue}
        />
      </div>
    );
  }

  if (screen === 'gameover') {
    return (
      <div className="app">
        <GameOver
          score={totalScore}
          level={level}
          playerName={playerName}
          savedToBoard={savedToBoard}
          onRetryLevel={handleRetryLevel}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  if (screen === 'winner') {
    return (
      <div className="app">
        <WinnerScreen
          score={totalScore}
          playerName={playerName}
          savedToBoard={savedToBoard}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return null;
}
