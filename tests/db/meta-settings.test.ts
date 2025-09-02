// Phase 0 — Meta and engine_settings tests (skeleton)
import { describe, it, expect } from 'vitest';
import { openInMemoryDb, applyMigrations, tableExists } from './utils';

describe('Meta & engine settings', () => {
  it('creates app_meta, engine_settings, migrations_applied, audit_logs', () => {
    const db = openInMemoryDb();
    applyMigrations(db);

    expect(tableExists(db, 'app_meta')).toBe(true);
    expect(tableExists(db, 'engine_settings')).toBe(true);
    expect(tableExists(db, 'migrations_applied')).toBe(true);
    expect(tableExists(db, 'audit_logs')).toBe(true);
  });

  it('persists engine settings key/value JSON', () => {
    const db = openInMemoryDb();
    applyMigrations(db);

    db.prepare("INSERT INTO engine_settings (key, value_json) VALUES (?, ?)").run(
      'unit_system',
      JSON.stringify({ value: 'imperial' })
    );
    const row = db.prepare("SELECT value_json FROM engine_settings WHERE key='unit_system'").get();
    const parsed = JSON.parse(row.value_json);
    expect(parsed.value).toBe('imperial');
  });
});

