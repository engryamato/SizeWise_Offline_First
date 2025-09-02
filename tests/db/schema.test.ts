// Phase 0 — Schema constraint tests (skeleton)
import { describe, it, expect } from 'vitest';
import { openInMemoryDb, applyMigrations } from './utils';

describe('Schema constraints', () => {
  it('enforces shape/dimension checks and endpoint RESTRICT', () => {
    const db = openInMemoryDb();
    applyMigrations(db);

    db.exec("INSERT INTO projects (id, name, unit_system) VALUES ('p1','Demo','imperial')");
    db.exec("INSERT INTO jobs (id, project_id, name) VALUES ('j1','p1','Main')");
    db.exec("INSERT INTO endpoints (id, job_id, x_in, y_in, orientation) VALUES ('e1','j1',0,0,0), ('e2','j1',10,0,0)");

    // rect requires width_in & height_in
    expect(() => db.exec("INSERT INTO duct_runs (id, job_id, from_endpoint_id, to_endpoint_id, shape, length_ft, cfm) VALUES ('d1','j1','e1','e2','rect',10,1000)")).toThrow();
    // valid rect
    db.exec("INSERT INTO duct_runs (id, job_id, from_endpoint_id, to_endpoint_id, shape, width_in, height_in, length_ft, cfm) VALUES ('d1','j1','e1','e2','rect',18,12,25,850)");

    // endpoint deletion should fail due to RESTRICT
    expect(() => db.exec("DELETE FROM endpoints WHERE id='e1'"))).toThrow();
  });
});

