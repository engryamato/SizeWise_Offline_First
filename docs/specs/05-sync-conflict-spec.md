# Offline Sync & Conflict Resolution (Draft v0.1)

Assumption: Optional cloud sync; desktop-first. Choose LWW at field-level with vector clocks for deterministic merges; allow user overrides in conflicts.

## Identity & Versioning
- IDs: UUIDv4 for all entities
- Version vector per entity: { deviceId: counter }
- Tombstones for deletions with retention window (e.g., 90 days)

## Client Mutation Queue
- Each local mutation recorded as command: { id, entity, entityId, op, fields, vv, ts }
- Queue persisted in SQLite; transactions ensure durability
- Retry with exponential backoff; jitter; max retries; dead-letter bin with user surface

## Transport API (draft)
- Auth: PAT or OAuth2 device code flow
- Endpoints (prefix /v1):
  - POST /sync/batch { deviceId, since, commands[] } → { acked[], rejections[], serverChanges[], newSince }
  - GET /sync/changes?since=... → { serverChanges[], newSince }
  - POST /conflicts/resolve { resolutions[] }
- Pagination via `cursor` or `since` token; server returns deltas

## Merge Policy
- Field-level LWW using (vector clock compares). If concurrent, prefer higher wall-clock with tolerated skew (e.g., 2 min), else device priority table.
- Certain fields are immutable (ids, created_at). Some fields prefer additive merge (tags: set-union).

## Conflict Types & UX
- Update/Update on same fields → present diff showing mine/theirs; suggest LWW pick with option to override
- Delete/Update → prompt restore or accept deletion
- Create/Create with same natural key (e.g., endpoint name in same project) → propose rename

## Offline Semantics
- App works fully when offline. Queue buffers until online. UI badge shows pending ops count.

## Idempotency & Ordering
- Commands carry idempotency key = command.id
- Server applies in causal order per entity using version vectors; rejects conflicting ops with CONFLICT codes and echoes latest state

## Error Handling
- Network errors: retry with backoff; queue persists
- Auth errors: pause and prompt re-auth
- Validation errors: move to dead-letter with details; user-editable fix then re-enqueue

## Security
- TLS 1.2+; certificate pinning option
- Minimal payloads; PII-free

## Telemetry
- Sync metrics (count, latency, conflicts) recorded locally; opt-in send

