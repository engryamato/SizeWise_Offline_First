# Documentation Index (Build-from-Docs Plan)

This index lists all documents required to implement SizeWise end-to-end without ambiguity. Scope is desktop-only (Electron), no smartphones.

## Product & Scope
- 21-mvp-acceptance-checklist.md — MVP features to deliver
- 34-procedures-notion-desktop-patch.md — Notion patch to enforce desktop-only

## Architecture & Services
- 01-architecture.md — C4, process/module boundaries
- 02-module-contracts.md — service interfaces
- 16-implementation-blueprints.md — IPC/worker/DB patterns, layout
- 36-ipc-api-reference.md — complete IPC method catalog (request/response)
- 45-adr-index.md — decision records (desktop-only, SQLite engine, updater)

## Data & File Formats
- 03-sizewise-file-format.md — container, integrity/signing/encryption
- 38-sizewise-json-schema.md — normative JSON Schema for .sizewise
- 23-procedures-data-and-files.md — import/export flows, canonicalization
- 14-sample-data.md — sample .sizewise and seed SQL

## Calculations & Rules
- 04-calculation-rules.md — equations, validation, goldens plan
- 17-constants-sourcing-protocol.md — how to verify constants with citations
- 20-ruleset-json-schema.md — schema for ruleset constants
- 35-procedures-ruleset-seed.md — seed file procedure (embedded example)

## Security & Resilience
- 07-security-requirements.md — encryption, keystore, updates integrity
- 08-error-resilience.md — error codes, retry/backoff, WAL/backup
- 39-error-message-catalog.md — user-facing messages by code

## Exporting & Reporting
- 10-exporters-spec.md — PDF/CSV/DXF mappings, determinism
- 27-procedures-exporters.md — implementation procedure

## Deployment & Operations
- 06-deployment-playbook.md — packaging, updater, signing
- 18-ci-cd-skeleton.md — CI workflows outline
- 28-procedures-deployment.md — step-by-step operations
- 42-release-operations-guide.md — release steps, rollback template
- 44-platform-support-matrix.md — OS versions, installer details

## Testing & Quality
- 11-testing-strategy.md — unit/integration/E2E/perf
- 29-procedures-testing-performance.md — test/perf plan
- 48-qa-test-case-inventory.md — enumerated test cases

## UI & Accessibility
- 19-ui-component-catalog.md — components/props/tokens/a11y
- 30-procedures-ui.md — component state/event procedures
- 40-accessibility-standards.md — keyboard, ARIA, contrast
- 46-ux-flows-state-machines.md — merge/split/resize flows

## Dev Setup & Standards
- 12-dev-setup.md — environment and scripts
- 13-dependencies-baseline.md — packages and versions
- 41-coding-standards.md — TS, linting, commits, code review

## Observability & Support
- 15-observability-telemetry.md — opt-in telemetry and logs
- 31-procedures-observability-support.md — SOPs and escalation
- 43-troubleshooting-guide.md — end-user troubleshooting

## Licensing & Sync
- 09-licensing-tier-spec.md — license blob, enforcement, grace
- 32-procedures-licensing.md — procedure and checks
- 05-sync-conflict-spec.md — if in MVP; else see 33 to de-scope
- 33-procedures-sync-decision.md — MVP decision record

Use this index as the Table of Contents for implementation planning and reviews.

