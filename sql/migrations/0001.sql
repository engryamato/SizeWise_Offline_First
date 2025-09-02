-- Migration 0001 — Core intake schema (projects, jobs, endpoints, duct_runs, fittings)
-- Notes:
-- - Results tables will be added in 0002
-- - Spatial/canvas extensions in 0003
-- - Meta and migration tracking in 0004
-- - Indexes/constraints/trigger refinements in 0005

BEGIN;

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unit_system TEXT NOT NULL CONSTRAINT CHECK_unit_system CHECK (unit_system IN ('imperial','metric')),
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CONSTRAINT FK_jobs_project_id FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS endpoints (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  label TEXT,
  x_in REAL NOT NULL,
  y_in REAL NOT NULL,
  orientation REAL NOT NULL DEFAULT 0, -- degrees
  layer TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CONSTRAINT FK_endpoints_job_id FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS duct_runs (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  from_endpoint_id TEXT NOT NULL,
  to_endpoint_id TEXT NOT NULL,
  shape TEXT NOT NULL CONSTRAINT CHECK_shape_type CHECK (shape IN ('rect','round')),
  width_in REAL, -- required if rect
  height_in REAL, -- required if rect
  diameter_in REAL, -- required if round
  length_ft REAL NOT NULL CONSTRAINT CHECK_length_ft_positive CHECK (length_ft > 0),
  material TEXT,
  lining TEXT,
  cfm REAL NOT NULL CONSTRAINT CHECK_cfm_positive CHECK (cfm > 0),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CONSTRAINT FK_duct_runs_job_id FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT FK_duct_runs_from_endpoint_id FOREIGN KEY (from_endpoint_id) REFERENCES endpoints(id) ON DELETE RESTRICT,
  CONSTRAINT FK_duct_runs_to_endpoint_id FOREIGN KEY (to_endpoint_id) REFERENCES endpoints(id) ON DELETE RESTRICT,
  CONSTRAINT CHECK_shape_dimensions CHECK (
    (shape = 'rect' AND width_in IS NOT NULL AND height_in IS NOT NULL) OR
    (shape = 'round' AND diameter_in IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS fittings (
  id TEXT PRIMARY KEY,
  duct_run_id TEXT NOT NULL,
  type TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  params_json TEXT, -- JSON blob for geometry-specific parameters
  k_value REAL, -- optional precomputed K
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CONSTRAINT FK_fittings_duct_run_id FOREIGN KEY (duct_run_id) REFERENCES duct_runs(id) ON DELETE CASCADE
);

COMMIT;
