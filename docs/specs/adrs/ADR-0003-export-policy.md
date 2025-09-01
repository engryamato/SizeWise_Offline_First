# ADR-0003 — Export Policy (Security & Allowlist)

Status: Accepted
Date: 2025-09-01

## Problem
Define what data is included in exports to preserve provenance, protect sensitive data, and keep files compact.

## Decision
- Exports MUST include intake and results with stable IDs and provenance metadata (app version, ruleset hash, timestamps).
- Exports MUST NOT include engine constants, pricing templates, or user secrets.
- Export formats MUST be limited to: .sizewise (JSON or ZIP as per ADR-0005), PDF, CSV, DXF.

## Consequences
### Positive
- Portable, verifiable files without leaking sensitive internals
- Deterministic content facilitates diffing and audit

### Negative
- Some advanced consumers may want constants; they will rely on documented ruleset versions instead

## Implementation Requirements
- Enforce allowlist at exporter boundaries; validate against schema before writing
- Add footers/headers with provenance; include exporter adapter version where applicable
- Apply watermarking when in Grace Mode (see ADR-0008)

