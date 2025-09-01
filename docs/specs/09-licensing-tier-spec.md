# Licensing & Tier Spec (Draft v0.1)

## Tiers & Limits
- trial, free, licensed (pro)
- Enforced limits (examples): edge_limit, project_limit (from DB license table)

## License Format (proposal)
- JSON license blob signed by vendor private key; contains tier, expiry, max limits, features
- Verification: vendor public key embedded in app; signature verified at import/launch

## State Machine
- trial → licensed or free (after trial ends)
- licensed → grace (on expiry) → free (after grace ends)

## Enforcement Points
- At UI action dispatch; at DataService level as last resort
- Hard blocks for over-limit creates; soft warnings near thresholds
- Grace Mode (default 7 days):
  - Editing allowed; exports allowed but watermarked (PDF/DXF/CSV)
  - Cloud sync (if present) disabled; batch exports disabled
  - Audit event recorded (lic_grace_entered) with anonymized fingerprint

## Storage & Security
- Store license blob and verification status; cache in DB; keep original file
- Sensitive fields hashed; secrets in OS keystore

## Offline Behavior
- Entirely local verification; online check optional; never blocks core offline functionality beyond tier limits

## Anti-tamper
- Signature verification failures → E_LIC_INVALID; disable licensed features; preserve user data

## Telemetry (opt-in)
- License tier name only, no PII

