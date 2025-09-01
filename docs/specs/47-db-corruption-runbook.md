# Runbook: Database Corruption & Recovery (Documents Only)

## Detection
- Startup health check: PRAGMA quick_check; if fails, PRAGMA integrity_check
- Watcher: unexpected SQLITE_CORRUPT/SQLITE_IOERR/SQLITE_NOTADB errors during ops

## Preflight
- Before repair attempts, create read-only snapshot copy of DB file with timestamp
- Record event in logs (correlationId)

## Recovery Flow (in order)
1) Safe snapshot → export .sizewise.recovery (best effort); inform user
2) Auto-backup restore → load last good WAL snapshot from appData/backups/auto/
3) Rebuild → VACUUM INTO new file; re-apply migrations; rebuild indices; verify quick_check
4) User prompt → if still failing, offer: Open recovery, Restore snapshot…, Contact support

## Give-up Threshold
- After 3 failed repairs within 10 minutes, stop auto-retries; block with guidance and support link

## Retention Policy
- Automatic backups: daily; keep last 7
- Recovery exports: keep last 3; older are pruned

## Messaging
- Title: “Project database looks damaged”
- Body: “We attempted automatic repair. Your latest changes may be in a recovery file.”
- Actions: “Open recovery”, “Restore snapshot…”, “Contact support”

