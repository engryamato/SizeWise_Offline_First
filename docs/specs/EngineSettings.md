# Engine Settings (Phase 0.5 Draft)

Scope: Persisted in SQLite (engine_settings key/value JSON). Preload exposes typed getters/setters; DataService implements persistence.

## Core
- units.system: 'imperial' | 'metric' (default: 'imperial')
- ruleset.version: string (e.g., '2025.08')
- ruleset.hash: string (SHA-256 of canonicalized ruleset)
- rounding.velocity_fpm: number (default: 1)
- rounding.loss_inwg: number (default: 0.01)
- calc.enable_property_based_tests: boolean (default: false)

## Canvas
- canvas.snap_grid_in: number (default: 1.0)
- canvas.snap_angle_deg: number (default: 15)
- canvas.snap_radius_in: number (default: 6)
- canvas.drag_debounce_ms: number (default: 16)
- canvas.write_idle_ms: number (default: 250)

## Performance Budgets
- perf.target_fps: number (default: 60)
- perf.max_endpoints: number (default: 500)
- perf.max_duct_runs: number (default: 1000)

## Persistence & Access
- Store as JSON values in engine_settings table with keys shown above
- Access via DataService.getEngineSetting/setEngineSetting

## Defaults (JSON example)
```json
{
  "units.system": "imperial",
  "ruleset.version": "2025.08",
  "ruleset.hash": "<sha256>",
  "rounding.velocity_fpm": 1,
  "rounding.loss_inwg": 0.01,
  "canvas.snap_grid_in": 1.0,
  "canvas.snap_angle_deg": 15,
  "canvas.snap_radius_in": 6,
  "canvas.drag_debounce_ms": 16,
  "canvas.write_idle_ms": 250,
  "perf.target_fps": 60,
  "perf.max_endpoints": 500,
  "perf.max_duct_runs": 1000
}
```

## Acceptance
- Settings can be saved/loaded via DataService
- Canvas and forms read the same keys; changes reflect without restart
- Defaults used when key absent; invalid values rejected by UI validation
