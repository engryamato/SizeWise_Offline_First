# SizeWise Offline-First — Repo Skeleton

This repository currently contains a minimal skeleton to begin Phase 0 (M0 Gap Resolution) and Phase 0.5 planning.

Scope: Desktop-only (Electron). No mobile. Tablets only when running desktop OS.

Directories created:
- app/main: Electron main process (services, ipc, bootstrap)
- app/preload: contextBridge APIs (typed, minimal)
- app/renderer: React UI (canvas, state, components)
- app/workers: calc engine + geometry strategies
- sql/migrations: database migrations (0001–0005 stubs)
- tests: unit, integration, e2e, and goldens placeholders
- docs/specs: added Phase 0/0.5 stub docs (Canvas Architecture, Engine Settings, Labor Cost, Export Validator)

Next steps (Phase 0):
- Finalize schema and author migrations (0001–0005)
- Define EngineSettings and persistence
- Document unified labor cost formula with examples
- Consolidate export validator policy
- Produce canonical golden vectors

