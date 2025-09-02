// Phase 0 — DataService tests (skeleton)
// Run after installing dev deps: pnpm add -D vitest @types/node && pnpm add better-sqlite3
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { DataService, DbError } from '../../app/main/services/DataService';

let tmpDir = '';

function mkTmpDbPath(name = 'sizewise-test.db') {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sizewise-db-'));
  return path.join(tmpDir, name);
}

function rmTmpDir() {
  if (tmpDir && fs.existsSync(tmpDir)) {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
  tmpDir = '';
}

beforeEach(() => {
  rmTmpDir();
});

afterEach(() => {
  rmTmpDir();
});

describe('DataService init & WAL', () => {
  it('enables WAL and applies migrations atomically', () => {
    const dbPath = mkTmpDbPath();
    const svc = new DataService(dbPath);
    svc.init();

    expect(svc.isOpen).toBe(true);
    expect(svc.journalMode.toLowerCase()).toBe('wal');
    expect(svc.foreignKeys).toBe(1);

    // Verify a core table exists (reach into handle for test purposes)
    const row = (svc as any).db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'").get();
    expect(row).toBeTruthy();
  });
});

describe('DataService settings', () => {
  it('persists and retrieves engine settings JSON', () => {
    const dbPath = mkTmpDbPath();
    const svc = new DataService(dbPath);
    svc.init();

    svc.setEngineSetting('unit_system', { value: 'imperial' });
    const val = svc.getEngineSetting<{ value: string }>('unit_system');
    expect(val?.value).toBe('imperial');
  });
});

describe('DataService error handling', () => {
  it('maps migration errors to E_DB_MIGRATION', () => {
    // Create a temp cwd with broken migrations
    const cwdBefore = process.cwd();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sizewise-mig-'));
    const migDir = path.join(dir, 'sql', 'migrations');
    fs.mkdirSync(migDir, { recursive: true });
    fs.writeFileSync(path.join(migDir, '0001.sql'), 'THIS IS INVALID SQL;');

    const dbPath = path.join(dir, 'broken.db');
    const svc = new DataService(dbPath);

    process.chdir(dir);
    try {
      expect(() => svc.init()).toThrowError(DbError);
      try { svc.init(); } catch (e: any) {
        expect(e.code).toBe('E_DB_MIGRATION');
      }
    } finally {
      process.chdir(cwdBefore);
    }
  });
});

