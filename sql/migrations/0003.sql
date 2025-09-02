-- Migration 0003 — Canvas/UI support tables (excluded from export)
-- Notes:
-- - These tables assist the canvas-first UI and are not part of exported .sizewise files
-- - Enforce via ExportValidator to exclude these tables from export

BEGIN;

CREATE TABLE IF NOT EXISTS canvas_hints (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CONSTRAINT CHECK_canvas_entity_type CHECK (entity_type IN ('endpoint','duct_run','fitting')),
  entity_id TEXT NOT NULL,
  z_index INTEGER NOT NULL DEFAULT 0,
  collapsed INTEGER NOT NULL DEFAULT 0, -- boolean (0/1)
  color TEXT, -- optional UI color tag
  metadata_json TEXT, -- JSON blob for UI-only hints (e.g., selection state persistence)
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CONSTRAINT FK_canvas_hints_job_id FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

COMMIT;
