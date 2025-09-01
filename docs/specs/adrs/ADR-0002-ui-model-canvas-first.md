# ADR-0002 — UI Model (Canvas-First Canonical Intake)

Status: Accepted
Date: 2025-09-01

## Problem
Define the primary user interaction model for building duct systems while keeping forms synchronized and secondary.

## Decision
- Canvas-based intake MUST be the canonical source of truth for creating and editing segments.
- Forms MUST be synchronized secondary views reflecting canvas selections and model state.
- Canvas scope for MVP is orthogonal geometry (0°/90°; optional 45° via elbows only); no freehand, no arbitrary angles, no 3D.

## Consequences
### Positive
- Intuitive spatial editing aligned with HVAC workflows
- Reduced chance of model desync between views

### Negative
- Requires careful hit-testing, selection, and snapping logic
- Additional work for accessibility and keyboard-driven alternatives

## Implementation Requirements
- State machine for selection/edit/merge/split/resize flows
- Deterministic mapping from canvas actions to data mutations
- Forms auto-populate and validate against the same rules as canvas actions

