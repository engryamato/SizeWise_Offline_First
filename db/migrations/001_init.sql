-- SizeWise DB Schema v1 (matches docs/specs/03 and 38)
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unit_system TEXT NOT NULL CHECK (unit_system IN ('imperial','metric')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_projects_updated_at ON projects(updated_at);
CREATE INDEX idx_projects_status ON projects(status);

CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  altitude_ft REAL NOT NULL DEFAULT 0,
  preferred_velocity_fpm REAL,
  room_type TEXT,
  default_location_id TEXT REFERENCES locations(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_jobs_project ON jobs(project_id);
CREATE INDEX idx_jobs_project_order ON jobs(project_id, order_index);

CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  building TEXT,
  level TEXT,
  room_code TEXT,
  room_name TEXT,
  location_type TEXT,
  tags TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_locations_project ON locations(project_id);

CREATE TABLE endpoints (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('supply','return','equipment')),
  name TEXT,
  cfm_design INTEGER,
  location_id TEXT REFERENCES locations(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_endpoints_project ON endpoints(project_id);
CREATE INDEX idx_endpoints_location ON endpoints(location_id);

CREATE TABLE segments (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  shape TEXT NOT NULL CHECK (shape IN ('rect','round')),
  width_in REAL,
  height_in REAL,
  diameter_in REAL,
  length_ft REAL NOT NULL,
  cfm INTEGER NOT NULL,
  material TEXT,
  lining TEXT,
  from_endpoint_id TEXT REFERENCES endpoints(id),
  to_endpoint_id TEXT REFERENCES endpoints(id),
  assigned_location_id TEXT REFERENCES locations(id),
  elbow90_count INTEGER NOT NULL DEFAULT 0,
  elbow45_count INTEGER NOT NULL DEFAULT 0,
  tee_count INTEGER NOT NULL DEFAULT 0,
  transition_count INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK ((shape = 'rect' AND width_in > 0 AND height_in > 0 AND diameter_in IS NULL)
      OR (shape = 'round' AND diameter_in > 0 AND width_in IS NULL AND height_in IS NULL))
);
CREATE INDEX idx_segments_job ON segments(job_id);
CREATE INDEX idx_segments_job_shape ON segments(job_id, shape);
CREATE INDEX idx_segments_job_order ON segments(job_id, order_index);

CREATE TABLE results (
  id TEXT PRIMARY KEY,
  segment_id TEXT NOT NULL REFERENCES segments(id) ON DELETE CASCADE,
  area_ft2 REAL,
  velocity_fpm REAL,
  reynolds REAL,
  friction_per_100ft REAL,
  fittings_loss_in_wg REAL,
  total_loss_in_wg REAL,
  pressure_class TEXT,
  warnings TEXT,
  computed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_results_segment ON results(segment_id);
CREATE INDEX idx_results_computed_at ON results(computed_at);

CREATE TABLE snapshots (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  path TEXT,
  hash TEXT,
  note TEXT
);
CREATE INDEX idx_snapshots_project_created ON snapshots(project_id, created_at);

COMMIT;

