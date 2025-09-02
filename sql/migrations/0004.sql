-- Migration 0004 — Meta, engine settings, and migrations tracking
-- Notes:
-- - app_meta is a singleton row table
-- - engine_settings is a key/value JSON store aligned to EngineSettings interface
-- - migrations_applied records applied migrations
-- - audit_logs is optional but recommended for security/traceability

BEGIN;

CREATE TABLE IF NOT EXISTS app_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  schema_version TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_started_at TEXT,
  last_migrated_at TEXT
);

CREATE TABLE IF NOT EXISTS engine_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS migrations_applied (
  id TEXT PRIMARY KEY, -- e.g., '0001.sql'
  applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CONSTRAINT CHECK_audit_entity_type CHECK (entity_type IN ('project','job','endpoint','duct_run','fitting','result')),
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL CONSTRAINT CHECK_audit_action CHECK (action IN ('insert','update','delete')),
  diff_json TEXT, -- JSON patch/diff
  actor TEXT, -- optional user identifier
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

COMMIT;
