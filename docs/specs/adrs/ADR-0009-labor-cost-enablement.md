# ADR-0009 — Labor Cost Enablement (Placeholder)

Status: Accepted
Date: 2025-09-01

## Problem
Reserve decision record for enabling labor cost features post-MVP while keeping calculation engine insulated from pricing.

## Decision
- Costing features MUST remain out of MVP scope; calculation engine MUST output only technical metrics.
- Pricing integration MAY be added post-MVP via separate module; outputs MUST remain deterministic and audit-friendly.

## Consequences
### Positive
- Keeps MVP focused and auditable; avoids scope creep

### Negative
- Some users may expect costing earlier; set expectations via roadmap

## Implementation Requirements
- No cost fields in .sizewise schema v1
- Clear UI boundaries; pricing module interacts only with exported summary data

