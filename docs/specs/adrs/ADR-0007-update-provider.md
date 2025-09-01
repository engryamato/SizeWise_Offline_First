# ADR-0007 — Update Provider (GitHub Releases)

Status: Accepted
Date: 2025-09-01

## Problem
Select a hosted update provider for electron-updater with minimal operational overhead and strong security posture.

## Decision
- GitHub Releases MUST be used as the update provider for v1.
- Beta and Stable channels MUST be supported; promotion from beta to stable occurs after smoke tests.
- Rollback MUST be supported via allowDowngrade and channel pointer flip to prior stable tag.

## Consequences
### Positive
- Low operational overhead; integrates with existing GitHub workflows
- Built-in artifacts hosting and release notes

### Negative
- Private repository bandwidth limits may apply at scale
- S3 or custom providers may be needed later for very large audiences

## Implementation Requirements
- electron-builder publish config points to GitHub Releases
- CI uses OIDC/short-lived tokens; secrets not echoed
- Release workflow includes notarize/staple and RFC3161 timestamp

