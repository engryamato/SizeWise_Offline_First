# Testing Strategy (Draft v0.1)

## Scope
- Unit: calc engine (goldens + property-based), validators, licensing, helpers
- Integration: DB CRUD/migrations, encryption roundtrip, import/export, sync queue (if in scope)
- E2E: packaging/install/update, offline/online transitions, conflict UI (if sync)
- Performance: calc latency, canvas FPS, memory, cold start

## Tools
- Vitest/Jest for unit/integration
- Playwright for E2E (Electron mode)
- GitHub Actions matrix (Win/macOS/Linux)

## Golden Tests
- 10+ canonical segments/jobs with expected numeric outputs and warnings
- Lock rounding order and constants; fail fast on drift

## Fuzz & Invariants
- Fuzz import manifests with random omissions/extra keys → assert graceful failures (no crashes)
- Invariants: pressure loss ≥ 0; Reynolds ≥ 0; Q ≈ V·A within tolerance; unit conversions roundtrip within tolerance
- Cross-platform: file paths/line endings/locale differences don’t affect results

## Offline/Online Scenarios
- Simulate network loss; ensure queue persists; verify UI badges and retries (if sync)

## Packaging & Updates
- Build per OS; sign/notarize; run smoke tests on installed app; validate auto-update in a test channel

## Performance Budgets (initial)
- Input-to-result UI latency < 100ms typical
- Calc recompute for segment < 200ms typical
- Canvas panning ~60 FPS on mid-tier hardware
- Cold start < 2s; steady-state memory < 1.5 GB on large projects

