# MVP Acceptance Checklist (Documents Only)

Scope: Desktop-only. Sync optional (confirm in/out). This checklist is derived from the Notion Feature Specifications and technical specs.

## Project & Jobs
- [ ] Create/Open/Rename/Delete projects
- [ ] Templates/presets available
- [ ] Unit system per project; conversion verified
- [ ] Duct jobs CRUD, ordered segments per job (drag reorder)

## Segments & Calculations
- [ ] Rect/Round segments; inputs per spec (length, CFM, material, lining, fittings)
- [ ] Real-time compute (debounced); Calc worker thread pattern
- [ ] Outputs: velocity, Reynolds, friction/100ft, fittings, total loss, pressure class
- [ ] Validation and warnings per rules

## Locations & Endpoints
- [ ] Manage locations (building/level/room/type/tags)
- [ ] Manage endpoints (type/name/location/design CFM)
- [ ] Segment From/To and Runs Through assignment; breadcrumb shown

## Results & UI
- [ ] Results panel shows primary/secondary metrics + warnings
- [ ] Toasts, Undo/Redo, keyboard navigation, accessibility basics

## Data & Files
- [ ] SQLite schema per spec; migrations present; WAL enabled
- [ ] Export .sizewise (canonical, integrity hash, optional signing/encryption)
- [ ] Import .sizewise with validation and transactional upsert

## Exporters
- [ ] PDF/CSV/DXF exports (initial scope) with units and stable ordering

## Security & Resilience
- [ ] Encryption-at-rest policy implemented (scope defined)
- [ ] Update integrity (signed installers/updates) documented
- [ ] Error taxonomy; retry/backoff; backups; corruption handling

## Licensing
- [ ] License import/verification; tier limits enforced; grace state behavior
- [ ] Ruleset version/hash visible in UI; constants source documented

## Deployment/Update
- [ ] Build targets Win/macOS/Linux; signing/notarization checklists complete
- [ ] Auto-update channel behavior documented; rollback plan

## Testing/Performance
- [ ] Golden tests for 10+ segments/jobs
- [ ] E2E packaging/install/update smoke flow
- [ ] Performance budgets and measurement plan

## Observability & Privacy (opt-in)
- [ ] Crash/performance telemetry opt-in; sanitized logs

## Out-of-Scope Cleanup
- [ ] Notion mobile sections removed; desktop-only wording affirmed

