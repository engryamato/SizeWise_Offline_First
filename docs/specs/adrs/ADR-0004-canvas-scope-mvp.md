# ADR-0004 — Canvas Scope (MVP)

Status: Accepted
Date: 2025-09-01

## Problem
Constrain the MVP canvas feature set to guarantee determinism and delivery velocity.

## Decision
- Geometry MUST be orthogonal (0°/90°) with optional 45° via elbows only.
- Supported fittings MUST include: elbow90, elbow45, tee, transition, endcap.
- No freehand drawing, no arbitrary angles, no 3D, and no DXF import in MVP.

## Consequences
### Positive
- Reduced edge cases; simpler hit testing and snapping
- Easier to guarantee export determinism and performance

### Negative
- Limits flexibility for certain use cases (deferred to post-MVP)

## Implementation Requirements
- Snap grid and alignment rules; selection/merge/split/resize state machines
- Deterministic block placement for fittings to match DXF adapter
- Clear upgrade path documented for post-MVP features

