# ERD — Core Intake Schema (Draft for Review)

Entities:
- projects (1) ──< jobs (N)
- jobs (1) ──< endpoints (N)
- jobs (1) ──< duct_runs (N)
- duct_runs (1) ──< fittings (N)
- duct_runs (1) ──  results (1) — unique per duct_run (in 0002)

Notes:
- Canvas-first: endpoints store spatial coords/rotation; duct_runs reference endpoints (from/to).
- shape rect requires width+height; round requires diameter.
- fittings carry a type and params (JSON) for geometry-specific data; calculated K may be stored or derived.
- Timestamps are ISO UTC; updated_at to be maintained by application code.

Open questions:
- Material/lining vocabularies: string enums vs normalized tables?
- results cardinality: per duct_run, per fitting, or per segment-step? (to align in 0002)
- Constraints on endpoint deletion when referenced by duct_runs (currently RESTRICT; confirm UX).

