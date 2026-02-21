import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// snehamanohar.github.io is a user site deployed at the root.
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  plugins: [react()],
  base,
});
