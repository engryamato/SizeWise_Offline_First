# .sizewise File Format (Draft v0.2)

Goals: deterministic round-trip, versioned, integrity-protected, optionally encrypted.

## Container

- Format: JSON document (UTF-8) or ZIP container when embedding assets
- MIME type: application/vnd.sizewise+json (JSON) or application/vnd.sizewise+zip (ZIP)
- Top-level fields (JSON profile):
```json
{
  "format": "sizewise",
  "version": 1,
  "createdAt": "2025-08-25T00:00:00Z",
  "appVersion": "1.0.0",
  "project": { /* see schema */ },
  "entities": { /* jobs, segments, endpoints, locations, results */ },
  "meta": { "units": "imperial|metric", "publicKeyHint": "optional" },
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

- ZIP profile: place the above JSON at /manifest.json; include assets under /assets/**; integrity & signing apply to canonicalized manifest bytes.

## Entities (normalized)
- project: { id, name, unitSystem, createdAt, updatedAt, notes }
- jobs: [ { id, projectId, title, altitudeFt, preferredVelocityFpm, roomType, defaultLocationId } ]
- segments: [ { id, jobId, ... dimensions ..., cfm, fitting counts, fromEndpointId, toEndpointId, assignedLocationId } ]
- endpoints: [ { id, projectId, type, name, cfmDesign, locationId } ]
- locations: [ { id, projectId, building, level, roomCode, roomName, locationType, tags } ]
- results: [ { id, segmentId, velocityFpm, reynolds, frictionPer100ft, fittingsLoss, totalLoss, warnings, computedAt } ]

## Integrity & Signing

- Compute SHA-256 over the canonical JSON excluding `integrity` and `encryption` objects.
- Optional detached signature (ed25519 or RSA) over the same bytes; include a public key hint in meta when signed.
- Strict mode: refuse unsigned imports; Standard mode: allow unsigned with warning; Labs mode: allow bypass for testing only.

## Encryption (optional)

- AES-256-GCM with per-export random IV.
- Key derived from user passphrase via Argon2id; store salt and parameters in `encryption.kdf`.
- Password policy: min length 12, rate-limit decrypt attempts (e.g., 5 tries then exponential backoff)
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

