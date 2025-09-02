// Phase 0 — Migration round-trip tests (skeleton)
// Run after installing dev deps: pnpm add -D vitest @types/node && pnpm add better-sqlite3
import { describe, it, expect } from 'vitest';
import { openInMemoryDb, applyMigrations, tableExists, triggerExists, foreignKeyCheck } from './utils';

describe('DB migrations', () => {
  it('applies all migrations cleanly', () => {
    const db = openInMemoryDb();
    applyMigrations(db);
    // core tables
    expect(tableExists(db, 'projects')).toBe(true);
    expect(tableExists(db, 'jobs')).toBe(true);
    expect(tableExists(db, 'endpoints')).toBe(true);
    expect(tableExists(db, 'duct_runs')).toBe(true);
    expect(tableExists(db, 'fittings')).toBe(true);
    expect(tableExists(db, 'results')).toBe(true);
    expect(tableExists(db, 'canvas_hints')).toBe(true);

    // triggers present
    expect(triggerExists(db, 'trg_projects_updated_at')).toBe(true);
    expect(triggerExists(db, 'trg_jobs_updated_at')).toBe(true);
    expect(triggerExists(db, 'trg_endpoints_updated_at')).toBe(true);
    expect(triggerExists(db, 'trg_duct_runs_updated_at')).toBe(true);
    expect(triggerExists(db, 'trg_fittings_updated_at')).toBe(true);
    expect(triggerExists(db, 'trg_canvas_hints_updated_at')).toBe(true);

    // foreign key integrity (no orphans)
    expect(foreignKeyCheck(db)).toEqual([]);
  });
});

