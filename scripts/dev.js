#!/usr/bin/env node
// Phase 2 dev runner: starts Vite and Electron with HMR
import { spawn } from 'child_process';

const vite = spawn('pnpm', ['exec', 'vite'], { stdio: 'inherit' });

let electron;
function startElectron() {
  const env = { ...process.env };
  env.VITE_DEV_SERVER_URL = 'http://localhost:5173';
  electron = spawn('pnpm', ['exec', 'electron', 'app/main/main.ts'], { stdio: 'inherit', env });
}

vite.on('spawn', () => {
  startElectron();
});

process.on('SIGINT', () => {
  vite.kill('SIGINT');
  if (electron) electron.kill('SIGINT');
});

