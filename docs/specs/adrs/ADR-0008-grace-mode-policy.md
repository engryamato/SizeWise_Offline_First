# ADR-0008 — Grace Mode Policy

Status: Accepted
Date: 2025-09-01

## Problem
Define application behavior when license verification fails or expires without abruptly blocking workflows.

## Decision
- Grace Mode MUST last 7 days by default.
- Editing MUST be allowed during grace.
- Exports MUST be watermarked (PDF/DXF/CSV) and batch exports MUST be disabled.
- Cloud sync (if present) MUST be disabled while in grace.
- An audit event SHOULD be recorded (lic_grace_entered) without PII.

## Consequences
### Positive
- Users remain productive; encourages swift reactivation without data loss

### Negative
- Some workflows (batch exports/sync) are constrained during grace

## Implementation Requirements
- Watermark format defined and applied in exporters
- UI banner with grace end date; link to re-activate
- Event logged locally; included in support bundle

