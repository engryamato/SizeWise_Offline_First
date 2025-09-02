// Phase 0 — Performance baselines (skeleton)
import { describe, it, expect } from 'vitest';
import { openInMemoryDb, applyMigrations } from './utils';

describe('DB performance baselines', () => {
  it('inserts and queries 1k duct_runs under threshold', () => {
    const db = openInMemoryDb();
    applyMigrations(db);

    const t0 = Date.now();
    db.exec("INSERT INTO projects (id, name, unit_system) VALUES ('p1','Perf','imperial')");
    db.exec("INSERT INTO jobs (id, project_id, name) VALUES ('j1','p1','Perf Job')");

    db.exec("INSERT INTO endpoints (id, job_id, x_in, y_in, orientation) VALUES ('e1','j1',0,0,0), ('e2','j1',1000,0,0)");

    const insert = db.prepare("INSERT INTO duct_runs (id, job_id, from_endpoint_id, to_endpoint_id, shape, width_in, height_in, length_ft, cfm) VALUES (?, 'j1', 'e1', 'e2', 'rect', 18, 12, 25, 850)");
    for (let i = 0; i < 1000; i++) insert.run(`d${i}`);

    const count = db.prepare("SELECT COUNT(*) as c FROM duct_runs WHERE job_id='j1'").get().c;
    const t1 = Date.now();

    expect(count).toBe(1000);
    const elapsedMs = t1 - t0;
    // Placeholder threshold until we gather real baselines
    expect(elapsedMs).toBeLessThan(1000 * 5);
  });
});

