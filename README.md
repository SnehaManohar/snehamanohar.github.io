# Snake Game

A classic snake game built with React + Vite. Three levels of increasing difficulty, canvas-based rendering, responsive mobile layout, and full Docker support.

## Play Online (GitHub Pages)

After deploying (see below), the game is playable at:

```
https://<your-username>.github.io/snake-game/
```

Works in any modern mobile or desktop browser — no installation needed.

---

## Deploying to GitHub Pages

### Automatic (GitHub Actions)

1. Push the repository to GitHub.
2. In the repo settings, go to **Pages → Source** and select **GitHub Actions**.
3. Push to the `main` branch — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

If your repository is named something other than `snake-game`, update the `base` value in `vite.config.js`:

```js
const base = process.env.VITE_BASE ?? '/your-repo-name/';
```

Or pass it via the environment:

```bash
VITE_BASE=/your-repo-name/ npm run build
```

### Manual build

```bash
npm install
npm run build   # outputs to dist/
```

Upload the contents of `dist/` to any static host.

---

## Running with Docker

### Docker Compose (recommended)

```bash
docker compose up --build
```

Visit http://localhost:3000

To stop:

```bash
docker compose down
```

### Docker CLI

```bash
docker build -t snake-game .
docker run -p 3000:80 snake-game
```

---

## Running locally

```bash
npm install
npm run dev
```

---

## How to play

| Platform | Controls |
|----------|----------|
| Desktop  | Arrow keys or WASD |
| Mobile   | Swipe on the board **or** tap the D-pad below the canvas |

- Eat **15 pellets** to advance to the next level
- Avoid your own body and obstacles
- The boundary wraps — exiting one edge re-enters from the opposite side

---

## Levels

| Level | Obstacles | Speed | Points / pellet |
|-------|-----------|-------|-----------------|
| 1 | None | 160 ms/tick | 10 |
| 2 | Static obstacles | 130 ms/tick | 20 |
| 3 | Static + 3 moving obstacles | 110 ms/tick | 30 |

Maximum possible score: 15 × (10 + 20 + 30) = **900 points**

---

## Project structure

```
.github/
└── workflows/
    └── deploy.yml       # GitHub Actions → GitHub Pages CI/CD
src/
├── App.jsx              # State machine (menu/playing/transition/gameover/winner)
├── App.css              # Global dark theme + responsive + D-pad styles
├── hooks/
│   ├── useSnakeGame.js  # Game loop, collision, movement, keyboard + swipe input
│   └── useCanvasSize.js # Responsive cell-size calculation (resizes with viewport)
├── components/
│   ├── GameBoard.jsx        # Canvas renderer — accepts dynamic cellSize prop
│   ├── TouchControls.jsx    # D-pad overlay for mobile play
│   ├── HUD.jsx              # Level / pellets / score strip above the board
│   ├── Menu.jsx             # Start screen with level descriptions
│   ├── LevelTransition.jsx  # 2-second "Level X Complete!" interstitial
│   ├── GameOver.jsx         # Game over screen with final score
│   └── WinnerScreen.jsx     # Victory screen with snake SVG illustration
└── utils/
    ├── levels.js        # Level configs: speed, static obstacles, moving obstacles
    └── scores.js        # localStorage read/write for top-5 leaderboard
```
