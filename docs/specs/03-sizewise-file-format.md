# .sizewise File Format (Draft v0.1)

Goals: deterministic round-trip, versioned, integrity-protected, optionally encrypted.

## Container
- Format: JSON document (UTF-8)
- Top-level fields:
```json
{
  "format": "sizewise",
  "version": 1,
  "createdAt": "2025-08-25T00:00:00Z",
  "appVersion": "1.0.0",
  "project": { /* see schema */ },
  "entities": { /* jobs, segments, endpoints, locations, results */ },
  "meta": { "units": "imperial|metric" },
  "integrity": {
    "algo": "SHA-256",
    "hash": "<hex>",
    "signed": false,
    "signature": null
  },
  "encryption": {
    "alg": null,
    "iv": null,
    "kdf": null
  }
}
```

## Entities (normalized)
- project: { id, name, unitSystem, createdAt, updatedAt, notes }
- jobs: [ { id, projectId, title, altitudeFt, preferredVelocityFpm, roomType, defaultLocationId } ]
- segments: [ { id, jobId, ... dimensions ..., cfm, fitting counts, fromEndpointId, toEndpointId, assignedLocationId } ]
- endpoints: [ { id, projectId, type, name, cfmDesign, locationId } ]
- locations: [ { id, projectId, building, level, roomCode, roomName, locationType, tags } ]
- results: [ { id, segmentId, velocityFpm, reynolds, frictionPer100ft, fittingsLoss, totalLoss, warnings, computedAt } ]

## Integrity
- Compute SHA-256 over the JSON canonical form excluding `integrity` and `encryption` objects.
- Optional signing: detached signature over the same bytes; include public key hint in meta when signed.

## Encryption (optional)
- AES-256-GCM with per-export random IV.
- Key derived from user passphrase via Argon2id; store salt and parameters in `encryption.kdf`.
- When encrypted, JSON payload becomes a compact binary blob encoded in base64 under `payload`, and most top-level fields move into an unencrypted header: { format, version, createdAt, appVersion, meta, encryption, integrity }.

## Versioning & Migration
- `version` integer increments on breaking changes.
- Importer supports previous N versions with deterministic migration steps recorded in logs.

## Roundtrip Rules
- Preserve IDs and referential integrity.
- Sort arrays by stable keys for canonicalization.
- Omit null/undefined fields to minimize diffs.

## Failure Modes
- On integrity mismatch: reject with E_EXPORT_FORMAT.
- On signature failure: reject with E_EXPORT_FORMAT.
- On decrypt failure: reject with E_SECURITY_ENCRYPTION.

