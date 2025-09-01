# Error Taxonomy & Resilience (Draft v0.1)

## Error Codes
- E_INPUT_VALIDATION: invalid user inputs or domain rules
- E_DB_CONSTRAINT: FK/UNIQUE/CHECK violations
- E_DB_CORRUPTION: SQLite corruption detected
- E_EXPORT_FORMAT / E_IMPORT_FORMAT: file integrity/signature/schema errors
- E_SYNC_NETWORK / E_SYNC_CONFLICT: sync connectivity/conflict
- E_LIC_INVALID: invalid/expired license or tamper detected
- E_UPDATE_VERIFY: update signature/verification failure
- E_SECURITY_ENCRYPTION: encryption/decryption or KDF failures

## Retry/Backoff Policies
- Network (sync/updates): exponential backoff (initial 2s, factor 2.0, jitter ±20%, max 2m); cap retries or pause on user request
- DB busy: short retry loop with increasing sleeps (5ms→50ms)
- Dead-letter: after max retries, move mutation or task to DLQ with actionable message; surface in UI

## Database Resilience
- PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA synchronous = NORMAL
- Backups: daily lightweight backup to appData/backups with rotation (keep last 7)
- Preflight: on boot, create a read-only snapshot copy before any repair attempts
- Corruption flow (in order):
  1) Safe snapshot → export .sizewise.recovery (best effort)
  2) Auto-backup restore → load last good WAL snapshot (/backups/auto/<ts>.db)
  3) Rebuild → VACUUM INTO new file, re-apply migrations, re-hydrate indices
  4) User prompt → if still failing, offer “Restore snapshot…”, “Open recovery”, “Contact support”
- Give-up threshold: after 3 failed repairs within 10 minutes, stop auto-retries and block with guidance

## Crash-safe Writes
- Use transactions for multi-entity writes; ensure fsync via SQLite defaults; avoid long transactions in UI paths

## Autosave & Recovery
- Autosave interval configurable; persist work-in-progress; on crash, offer recovery

## User Messaging Convention
- Errors: short title + details + help link; include error code
- Warnings: non-blocking; explain impact and remediation

## Logging
- Structured logs with code, component, correlationId; redact payload fields
- Rotate logs and cap size; provide “collect logs” tool

