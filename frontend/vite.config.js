import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables global test functions like beforeEach, afterEach, etc.
    environment: 'jsdom', // Ensures you have a DOM environment for testing React components
    setupFiles: './src/test/setup.js', // Optional: for custom global setup, if needed
  },
});
