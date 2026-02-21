import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set base to the GitHub repository name (with leading/trailing slashes).
// Example: if your repo is https://github.com/alice/snake-game, use '/snake-game/'.
// For a user/org site deployed at the root, use '/'.
const base = process.env.VITE_BASE ?? '/snake-game/';

export default defineConfig({
  plugins: [react()],
  base,
});
