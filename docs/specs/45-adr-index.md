# Architecture Decision Records (Index)

Document key decisions and their rationale. Create one ADR per decision.

## Accepted ADRs
- ADR-0005 SizeWise Packaging (.sizewise JSON/ZIP)
- ADR-0006 DXF Profile & Fonts (R2018, inches, Arial with SHX fallback)
- ADR-0007 Update Provider (GitHub Releases)
- ADR-0008 Grace Mode Policy (7 days, watermark, sync/batch restrictions)
- ADR-0009 Labor Cost Enablement (post-MVP, placeholder)

## Proposed ADRs
- ADR-001 Desktop-only scope; no smartphones; Electron primary
- ADR-002 Database engine: SQLite via better-sqlite3; WAL; migrations strategy
- ADR-003 Update mechanism: electron-updater with provider (GitHub Releases/S3)
- ADR-004 File format: .sizewise JSON with integrity+optional signing/encryption
- ADR-005 Security posture: encryption-at-rest (scope), OS keystore for keys, opt-in telemetry
- ADR-006 Calculation engine: deterministic pure functions + ruleset JSON
- ADR-007 Exporters: pdf-lib + dxf-writer initial scope
- ADR-008 Licensing: signed JSON license blob; offline verification; tier gates
- ADR-009 Sync MVP: decision and approach (in or out)

