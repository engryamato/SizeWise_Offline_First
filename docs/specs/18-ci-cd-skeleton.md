# CI/CD Skeleton (Documentation only)

## Goals
- Reproducible builds per OS with signing/notarization
- Automated tests (unit/integration/e2e) and performance smoke checks
- Release channels: beta → stable

## GitHub Actions Outline
- workflow: ci.yml
  - jobs: lint, unit, integration (DB import/export), e2e-electron, build-matrix
  - cache Node modules; matrix: windows-latest, macos-latest, ubuntu-latest

- workflow: release.yml
  - on: tag push (vX.Y.Z or vX.Y.Z-beta.N)
  - jobs: build-sign-notarize → publish (GitHub Releases) → create release notes

## Secrets Required
- WIN_CSC_LINK / WIN_CSC_KEY_PASSWORD (Windows signing)
- CSC_LINK / CSC_KEY_PASSWORD (macOS Developer ID)
- GH_TOKEN for GitHub Releases

## Provenance
- Consider SLSA/GitHub OIDC attestation for build provenance

