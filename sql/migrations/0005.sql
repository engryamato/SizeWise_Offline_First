-- Migration 0005 — Indexes, triggers, and performance refinements
-- Notes:
-- - Create helpful indexes for lookups and ordering
-- - Add triggers to maintain updated_at timestamps

BEGIN;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_project_id ON jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_endpoints_job_id ON endpoints(job_id);
CREATE INDEX IF NOT EXISTS idx_duct_runs_job_id ON duct_runs(job_id);
CREATE INDEX IF NOT EXISTS idx_fittings_duct_run_id ON fittings(duct_run_id);
CREATE INDEX IF NOT EXISTS idx_results_duct_run_id ON results(duct_run_id);
CREATE INDEX IF NOT EXISTS idx_canvas_hints_job ON canvas_hints(job_id);

-- updated_at triggers
CREATE TRIGGER IF NOT EXISTS trg_projects_updated_at
AFTER UPDATE ON projects
FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE projects SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_jobs_updated_at
AFTER UPDATE ON jobs
FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE jobs SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_endpoints_updated_at
AFTER UPDATE ON endpoints
FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE endpoints SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_duct_runs_updated_at
AFTER UPDATE ON duct_runs
FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE duct_runs SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_fittings_updated_at
AFTER UPDATE ON fittings
FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE fittings SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_canvas_hints_updated_at
AFTER UPDATE ON canvas_hints
FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE canvas_hints SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

COMMIT;
