# Canvas Architecture (Phase 0.5 Draft)

Status: Draft for review
Scope: Desktop-only. Canvas is the canonical intake; forms are synchronized mirrors. Endpoints are spatial primitives; duct_runs connect endpoints; fittings attach to runs.

## Goals
- Canvas-first data entry with deterministic sync to DB
- Smooth interactions at 60 FPS target with predictable fallbacks
- Simple, testable event/state model; transactions guarantee consistency

## Tech & Integration
- Renderer: React + Pixi.js (via @pixi/*)
- State: lightweight store (e.g., Zustand) with action creators and undo/redo stack
- IPC: Renderer actions → Preload API → DataService (Main) → SQLite

## Scene Graph (Layers)
1. background (grid, axes, extents)
2. guides (snap lines, alignment hints)
3. ducts (duct_runs as polylines with width/diameter labels)
4. fittings (symbols with rotation/params)
5. endpoints (nodes with labels)
6. annotations (dimensions, warnings badges)
7. selection (highlight, handles)
8. overlay (cursor, marquee, drag previews)

Entity mapping:
- endpoint: circle sprite + hit area; data { id, job_id, x_in, y_in, orientation }
- duct_run: graphics polyline; data { id, from/to endpoint ids, shape, width_in/height_in|diameter_in }
- fitting: sprite; data { id, duct_run_id, type, params_json }

## Spatial & Units
- Canvas units in inches; zoom/pan transforms applied at layer level.
- length_ft in duct_runs is derived from geometry: distance(from,to) plus fitting offsets; persisted as feet (ft).
- Orientation in degrees; shown as 0–360 (normalize on write).

## Interaction & Selection
- Primary tools: select, pan (spacebar), create endpoint, create duct_run, insert fitting, edit dimensions.
- Selection model: single/multi with marquee; SHIFT toggles, CTRL adds.
- Handles: endpoints draggable; duct_run midpoints for bending (future); fitting rotation handles when selected.

## Snapping
- Grid snapping (configurable grid size in inches)
- Endpoint magnets (snap to nearby endpoints within radius)
- Angle snapping (e.g., 15° increments) when rotating or creating runs
- Alignment guides (orthogonal/horizontal/vertical)

Proposed EngineSettings keys:
- canvas.snap_grid_in: number (default 1.0)
- canvas.snap_angle_deg: number (default 15)
- canvas.snap_radius_in: number (default 6)
- canvas.drag_debounce_ms: number (default 16)
- canvas.write_idle_ms: number (default 250)

## Event & Sync Model
- Canvas is canonical: changes originate on canvas and produce atomic DB transactions.
- Forms mirror state by subscribing to the store; editing forms dispatches the same actions as canvas.

Action flow:
- UI → dispatch(Action) → store reducer updates local state immediately (optimistic)
- Side effect layer batches writes: after idle (write_idle_ms), computes a transaction and calls Preload API → DataService
- DataService writes: endpoints / duct_runs / fittings in one transaction; recalculates length_ft and timestamps; then notifies renderer via IPC event

Core actions (subset):
- CREATE_ENDPOINT(id, job_id, x_in, y_in, orientation)
- MOVE_ENDPOINT(id, x_in, y_in)
- CREATE_DUCT_RUN(id, job_id, from_endpoint_id, to_endpoint_id, shape, dims)
- UPDATE_DUCT_RUN_DIMENSIONS(id, dims)
- INSERT_FITTING(id, duct_run_id, type, params)
- SELECT(ids[]), CLEAR_SELECTION()
- UNDO(), REDO()

Atomicity rules:
- Moving an endpoint updates all connected duct_runs length_ft in the same DB transaction.
- Deleting an endpoint with connections is disallowed (DB RESTRICT) → UI shows guidance to delete runs first.
- Updates to shape/dimensions revalidate CHECK constraints before commit; failures roll back and show error code.

## Performance Budgets & Instrumentation
Targets:
- 60 FPS target under typical load (≤ 500 endpoints, ≤ 1,000 duct_runs)
- Interaction latency: < 50 ms from pointer-up to persisted DB transaction
- Initial render under 200 ms on cold start dataset (≤ 200 runs)

Instrumentation:
- rAF-based FPS sampler; log 1%/50%/99% frame times
- Memory sampling via performance.memory when available
- Interaction timers (drag start → commit) and DB write durations
- Dev overlay to visualize node counts and FPS

Degradation plan:
- When FPS < 40 for 2s: reduce guide/annotation detail, disable per-frame shadows, coalesce interactions
- When nodes > thresholds: switch hit testing from Pixi interaction to spatial index (quadtree)

## Hit Testing & Spatial Index
- Start with Pixi’s built-in hit testing
- Add quadtree (e.g., rbush/O( log n )) for endpoints and duct midpoint handles when node count exceeds threshold
- Keep index in store and update incrementally on move/create/delete

## Undo/Redo
- Command pattern with bounded history (e.g., 100 ops)
- Each action records inverse operation and affected IDs
- Batches: continuous drag groups into one command

## Error Handling & Resilience
- Input validation on store edge; render warnings on invalid values
- DB errors mapped to error catalog; UI toasts with code and advice
- Auto-save guard: warn if write backlog > threshold

## Export & Privacy
- canvas_hints are UI-only; excluded from export via ExportValidator
- Exporters read only allowlisted tables/columns (see ExportValidator spec)

## Testing Plan (Phase 0.5 → later)
- Unit: reducers/actions (selection, snapping math), geometry length derivation
- Integration: simulated drag sequences producing correct DB transactions
- E2E (Playwright + Electron): select/drag/create flows; performance smoke (FPS ≥ target)

## Open Questions for Review
- Should length_ft always be derived, or allow override for special cases? (current: always derived)
- Midpoint bend editing scope in v1?
- Snap defaults appropriate for HVAC workflows?

