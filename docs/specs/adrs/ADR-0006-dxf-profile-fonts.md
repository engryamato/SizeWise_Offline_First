# ADR-0006 — DXF Profile & Fonts

Status: Accepted
Date: 2025-09-01

## Problem
Lock a CAD-consumable DXF output that downstream tools will reliably render with correct layers, units, and text.

## Decision
- DXF version MUST be R2018; units MUST be inches (INSUNITS=1); UCS World.
- Layers MUST follow the SizeWise layer map (DUCT_MAIN, FITTINGS, LABELS, NODES, GUIDES) with fixed color indices.
- Text style MUST be SIZEWISE_STD with Arial; SHOULD fallback to SHX if Arial unavailable.
- Text height SHOULD default to 0.125 in; configurable.
- Blocks for fittings (ELBOW_90_LR, ELBOW_45, TEE, TRANSITION) MUST use consistent insertion points.
- Adapter MUST support up to ~100k entities; writes MUST be chunked to avoid memory spikes.

## Consequences
### Positive
- Predictable CAD import and plotting
- Deterministic output across environments

### Negative
- Arial licensing and availability considerations
- SHX fallback limits glyphs to ASCII subset

## Implementation Requirements
- Document layer/style map in docs/specs/49-dxf-layer-style-map.md
- PDF/CSV exporters MUST include app version & ruleset hash; DXF MUST add header comments
- Performance harness MUST exercise a 100k-entity export case

