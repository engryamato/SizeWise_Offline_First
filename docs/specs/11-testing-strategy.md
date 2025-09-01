# Testing Strategy (Draft v0.2)

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

## Offline/Online Scenarios
- Simulate network loss; ensure queue persists; verify UI badges and retries (if sync)

## Packaging & Updates
- Build per OS; sign/notarize; run smoke tests on installed app; validate auto-update in a test channel

## Performance Budgets (initial)
- Input-to-result UI latency < 100ms typical
- Calc recompute for segment < 200ms typical
- Canvas panning ~60 FPS on mid-tier hardware
- Cold start < 2s; steady-state memory < 1.5 GB on large projects

## Performance Measurement Protocol
- Baseline hardware: one of
  - Intel i5-11400 (6C/12T), 16 GB RAM, NVMe SSD; Windows 11
  - Apple M1 (8C), 16 GB RAM; macOS 13+
- Method:
  - Warm-up: run each scenario 3 times; measure next 10; report P95
  - Disable background sync/updates; ensure consistent Node/Electron versions
  - Record environment in output (OS, CPU, RAM, Electron/Node versions)
- Datasets:
  - Small (≤300 segments), Medium (≤2,000), Large (≤10,000)
- Targets:
  - Bulk recompute: ≤2.5s (Medium, P95), ≤12s (Large, P95)
  - Canvas panning: ≥55 FPS steady on Large
  - Memory caps: ≤300MB (Small), ≤900MB (Medium), ≤1.5GB (Large)

