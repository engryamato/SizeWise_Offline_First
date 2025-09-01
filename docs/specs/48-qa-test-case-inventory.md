# QA Test Case Inventory (Documents Only)

Tagging: [Unit], [Integration], [E2E], [Perf]

## Project & Jobs
- [E2E] Create/Open/Rename/Delete projects; recent files
- [Integration] Template apply → fields populated
- [E2E] Unit system switch preserves values via conversions

## Segments & Calculations
- [Unit] Velocity/Reynolds/friction calculations on goldens (≥ 20 cases)
- [Unit] Unit conversion roundtrip idempotence within tolerance
- [Integration] Invalid inputs surface E_INPUT_VALIDATION with field highlights
- [Perf] Debounced edits hit SLA (Small ≤ 50ms P95)

## Locations & Endpoints
- [Integration] CRUD; endpoints linked to segments; breadcrumbs shown

## Import/Export
- [Integration] Export → import roundtrip equals manifest (canonicalized)
- [Unit] Integrity/signature checks (strict/standard/labs modes)
- [Integration] Encrypted export → decrypt with retry/backoff policy

## DXF/PDF/CSV
- [Integration] PDF footers include app + ruleset hash; fonts rendered
- [Integration] DXF layers/styles/units correct; entity count up to 100k
- [Integration] CSV column order stable; units correct

## Licensing
- [E2E] Grace Mode watermark on exports; sync disabled; audit event logged

## Resilience
- [E2E] Corrupt DB → runbook flow; restore snapshot
- [Integration] Backups rotate; give-up threshold blocks repeated repairs

## Updates
- [E2E] Beta → stable auto-update; rollback path works

## Cross-platform
- [E2E] Installers run; app launches; file paths and line endings OK on Win/macOS/Linux

