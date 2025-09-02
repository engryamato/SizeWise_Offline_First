# Export Validator Policy (Phase 0.5 Draft)

Scope: Define a deterministic, secure export of .sizewise files. Enforce via an allowlist; exclude UI-only tables (canvas_hints) and sensitive fields.

## Allowlist (tables → columns)
- projects: [id, name, unit_system, description, created_at, updated_at]
- jobs: [id, project_id, name, order_index, created_at, updated_at]
- endpoints: [id, job_id, label, x_in, y_in, orientation, layer, created_at, updated_at]
- duct_runs: [id, job_id, from_endpoint_id, to_endpoint_id, shape, width_in, height_in, diameter_in, length_ft, material, lining, cfm, notes, created_at, updated_at]
- fittings: [id, duct_run_id, type, order_index, params_json, k_value, created_at, updated_at]
- results: [id, duct_run_id, velocity_fpm, reynolds, friction_inwg_per100ft, fittings_loss_inwg, total_loss_inwg, pressure_class, warnings_json, ruleset_version, ruleset_hash, computed_at]

Excluded: canvas_hints, app_meta, engine_settings, migrations_applied, audit_logs

## Deterministic Ordering
- Order exports by: project → job(order_index, id) → duct_run(id) → fitting(order_index, id)
- Endpoints ordered by job_id, then id
- Results joined per duct_run_id

## Canonicalization
- Omit null/undefined fields
- Sort object keys lexicographically before hashing
- Normalize timestamps to ISO-8601 Z with millisecond precision
- Normalize orientation to [0,360)

## Integrity
- integrity.hash: SHA-256 over canonicalized JSON
- integrity.signed/signature: optional; reserved for future signing

## Validation Steps
1. Validate schema: only allowlisted tables/columns present
2. Validate constraints: foreign keys consistent; no dangling references
3. Validate determinism: repeated exports produce identical canonical JSON and hash

## Failure Modes & Errors
- E_EXPORT_DENYLIST: attempted export of non-allowlisted table/column
- E_EXPORT_INTEGRITY: hash/signature mismatch
- E_EXPORT_SCHEMA: structure violates JSON Schema
- E_EXPORT_REFERENTIAL: orphaned references detected

## Testing
- Golden export fixtures with stable hashes
- Negative tests attempting to include canvas_hints or engine_settings
- Round-trip import/export retains canonical form
