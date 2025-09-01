# ADR-0005 — SizeWise Packaging (.sizewise JSON/ZIP)

Status: Accepted
Date: 2025-09-01

## Problem
Define a portable, integrity-checked project bundle format that is deterministic, diffable, and can optionally include assets.

## Decision
- The .sizewise format MUST default to a single JSON file (UTF-8) for diffability.
- A ZIP container MAY be used only when embedding assets; manifest MUST be at /manifest.json.
- MIME types MUST be:
  - application/vnd.sizewise+json (JSON default)
  - application/vnd.sizewise+zip (ZIP with assets)
- Integrity MUST be SHA-256 over canonical JSON bytes.
- Signing MAY use a detached signature (ed25519 or RSA). Import modes:
  - Strict: signed only
  - Standard: unsigned allowed with warning
  - Labs: testing only

## Consequences
### Positive
- Simple diffs and code reviews for most exports
- Clear provenance with optional signatures
- Asset support when required without constraining the default

### Negative
- Two profiles to support (JSON and ZIP)
- Canonicalization rules must be strictly implemented to avoid false mismatches

## Implementation Requirements
- Canonical JSON writer and stable sort order of arrays
- ZIP profile layout: /manifest.json and /assets/**
- Enforce MIME types and OS association
- Import policy flags (strict/standard/labs) are user/CI configurable
- Password policy for encryption: min length 12; decrypt rate limiting

