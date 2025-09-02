import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  return {
    root: path.resolve(__dirname, 'app/renderer'),
    plugins: [react()],
    build: {
      outDir: path.resolve(__dirname, 'dist/renderer'),
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      strictPort: true,
      open: false,
    },
  };
});

