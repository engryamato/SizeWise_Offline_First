# Security Requirements (Draft v0.1)

Scope: Desktop-only (Electron). No smartphones. Tablets only if running desktop OS. Focus on protecting local project data, secrets, and update integrity.

## Threat Model (summary)
- Local device compromise: mitigate data-at-rest exposure
- Malicious update server/man-in-the-middle: verify signatures; HTTPS
- Import/export tampering: integrity checks, optional encryption
- Sensitive info leakage via logs/telemetry: sanitize, opt-in

## Requirements
- At-rest protection
  - Encrypt sensitive data (either full DB or selected tables/fields)
  - Keys stored via OS keystores: Keychain (macOS), DPAPI (Windows), libsecret (Linux) using keytar
  - Lockdown export encryption (AES‑256‑GCM) with Argon2id KDF when user sets a passphrase
- Update integrity
  - Use signed installers and signed auto-updates (electron-updater); reject unsigned artifacts
  - HTTPS/TLS 1.2+ to update provider; optional certificate pinning
- Integrity & signing for .sizewise
  - SHA‑256 over canonical JSON; optional detached signature (public key hint in meta)
- Logs & telemetry
  - Sanitize logs; never serialize full project payloads in error logs
  - Telemetry/crash reporting is opt-in; no PII; redact IDs when possible
- IPC hardening
  - contextIsolation: true; nodeIntegration: false; preload exposes minimal, typed APIs
  - Validate all inputs server-side (Main) before DB writes
- File paths & permissions
  - Store DB under appData; restrict file perms where supported; avoid temp plaintext secrets

## Crypto Choices (proposal)
- Symmetric: AES‑256‑GCM
- KDF: Argon2id (salt 16B, memory ≥ 64MB, parallelism ≥ 2, iterations calibrated to ~250ms on target hardware)
- Hash: SHA‑256 for integrity fields

## Key Lifecycle
- Generate random 256-bit content key per project (optional)
- Wrap with keystore-protected master secret or user passphrase (if configured)
- Rotation: allow key rotation on demand; re-encrypt; keep old keys until migration completes

## Failure Handling
- Decrypt failure → E_SECURITY_ENCRYPTION; user prompt to retry passphrase; never silently drop data
- Integrity mismatch → E_EXPORT_FORMAT; reject import; advise user

## Verification
- Security review checklist before release: update signing verified; encryption paths exercised; logs audited for leakage; crash reports contain no sensitive payloads

