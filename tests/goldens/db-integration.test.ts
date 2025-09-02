// Phase 0 — Golden dataset integration tests (skeleton)
import { describe, it, expect } from 'vitest';
import { openInMemoryDb, applyMigrations } from '../db/utils';

describe('Golden dataset ↔ schema integration', () => {
  it('accepts canonical segment and yields results row', () => {
    const db = openInMemoryDb();
    applyMigrations(db);

    // Seed minimal project/job/endpoints and a duct_run
    db.exec("INSERT INTO projects (id, name, unit_system) VALUES ('p1','Demo','imperial')");
    db.exec("INSERT INTO jobs (id, project_id, name) VALUES ('j1','p1','Supply Main')");
    db.exec("INSERT INTO endpoints (id, job_id, x_in, y_in, orientation) VALUES ('e1','j1',0,0,0), ('e2','j1',120,0,0)");
    db.exec("INSERT INTO duct_runs (id, job_id, from_endpoint_id, to_endpoint_id, shape, width_in, height_in, length_ft, cfm) VALUES ('d1','j1','e1','e2','rect',18,12,25,850)");

    // Simulate calc engine writing results
    db.exec("INSERT INTO results (id, duct_run_id, velocity_fpm, reynolds, friction_inwg_per100ft, fittings_loss_inwg, total_loss_inwg) VALUES ('r1','d1',567,12000,0.08,0.03,0.11)");

    const row = db.prepare("SELECT * FROM results WHERE duct_run_id='d1'").get();
    expect(row).toBeTruthy();
    expect(row.total_loss_inwg).toBeCloseTo(0.11);
  });
});

