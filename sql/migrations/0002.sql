-- Migration 0002 — Results (per-duct_run aggregation)
-- Notes:
-- - One row per duct_run (aggregate results)
-- - warnings stored as JSON text (array of codes/messages)
-- - ruleset_version/hash recorded for traceability

BEGIN;

CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  duct_run_id TEXT NOT NULL UNIQUE,
  velocity_fpm REAL NOT NULL CONSTRAINT CHECK_velocity_fpm_nonnegative CHECK (velocity_fpm >= 0),
  reynolds REAL NOT NULL CONSTRAINT CHECK_reynolds_nonnegative CHECK (reynolds >= 0),
  friction_inwg_per100ft REAL NOT NULL,
  fittings_loss_inwg REAL NOT NULL,
  total_loss_inwg REAL NOT NULL,
  pressure_class TEXT,
  warnings_json TEXT, -- JSON array
  ruleset_version TEXT,
  ruleset_hash TEXT,
  computed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CONSTRAINT FK_results_duct_run_id FOREIGN KEY (duct_run_id) REFERENCES duct_runs(id) ON DELETE CASCADE
);

COMMIT;
