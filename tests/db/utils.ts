// Test helpers for DB migrations and schema checks
// Note: Requires better-sqlite3 at runtime; this is a Phase 0 test skeleton.
// Install later with: pnpm add -D vitest @types/node && pnpm add better-sqlite3

// @ts-ignore: types will be available once deps are installed
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export function openInMemoryDb(): any /* Database */ {
  // @ts-ignore
  const db = new Database(':memory:');
  // Foreign keys on by default for tests
  db.pragma('foreign_keys = ON');
  return db;
}

export function applyMigrations(db: any /* Database */, migrationsDir = 'sql/migrations') {
  const dir = path.resolve(process.cwd(), migrationsDir);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf-8');
    db.exec(sql);
  }
}

export function tableExists(db: any /* Database */, table: string): boolean {
  const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table);
  return !!row;
}

export function triggerExists(db: any /* Database */, trigger: string): boolean {
  const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='trigger' AND name=?`).get(trigger);
  return !!row;
}

export function foreignKeyCheck(db: any /* Database */): Array<any> {
  return db.prepare('PRAGMA foreign_key_check').all();
}

