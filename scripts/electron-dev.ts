#!/usr/bin/env tsx
// Phase 2 — Dev runner with tsx loader for main/preload TypeScript
import { spawn } from 'child_process';

function start() {
  const vite = spawn('pnpm', ['exec', 'vite'], { stdio: 'inherit' });

  let electron: any;
  function startElectron() {
    const env = { ...process.env };
    env.VITE_DEV_SERVER_URL = env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    // Enable Node ESM loader for TypeScript via tsx
    env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --loader tsx`;
    electron = spawn('pnpm', ['exec', 'electron', 'app/main/main.ts'], { stdio: 'inherit', env });
  }

  vite.on('spawn', () => startElectron());

  process.on('SIGINT', () => {
    vite.kill('SIGINT');
    if (electron) electron.kill('SIGINT');
  });
}

start();

