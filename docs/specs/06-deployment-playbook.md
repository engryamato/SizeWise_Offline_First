# Deployment & Updates Playbook (Draft v0.2)

Scope: Desktop-only (Windows/macOS/Linux). No iOS/Android distribution. Tablets are supported only when running a desktop OS.
Target: Electron (desktop). Channels: stable, beta. Provider: GitHub Releases or S3. Auto updates via electron-updater.

## Targets
- Windows: NSIS or MSI; code signing with EV cert
- macOS: dmg or zip; Hardened Runtime + Notarization; Developer ID cert
- Linux: AppImage/deb/rpm; GPG signing optional

## electron-builder (example)
```json
{
  "appId": "com.sizewise.app",
  "productName": "SizeWise",
  "directories": { "output": "dist" },
  "files": ["build/**/*", "package.json"],
  "publish": [{ "provider": "github", "owner": "engryamato", "repo": "SizeWise_Offline_First" }],
  "mac": { "category": "public.app-category.developer-tools", "hardenedRuntime": true, "entitlements": "entitlements.mac.plist" },
  "win": { "target": "nsis" },
  "linux": { "target": ["AppImage"] }
}
```

## AutoUpdater wiring
- Use electron-updater in Main: check on start (deferred), allow manual check; download in background; prompt before apply.

## Signing & Notarization
- Store cert refs in CI secrets; never commit private keys. Prefer OIDC and keychain on self-hosted runners where possible.
- macOS: sign with Developer ID; notarize with notarytool; staple ticket; document Gatekeeper/App Translocation behavior.
- Windows: RFC3161 timestamping (e.g., http://timestamp.digicert.com); EV cert optional but recommended to build SmartScreen reputation.

## CI/CD (GitHub Actions sketch)
- Jobs: lint/test → build per OS → sign/notarize → publish release → upload artifacts → create release notes
- Use matrix builds; protect main; require passing checks

## Channels & Versioning
- Semantic versioning (Conventional Commits drive release notes). Beta channel for pre-release tags. AutoUpdater feeds by channel.

## Rollback Strategy
- Keep last 2 versions cached; allow user-triggered rollback. Updater allowDowngrade: true; flip channel pointer to prior stable tag for mass rollback.

## Release Notes
- Generated from conventional commits; include breaking changes section.

## Security
- Verify update signatures; HTTPS only; optional certificate pinning.

## Telemetry of Updates
- Opt-in metrics: check frequency, download success rate, failure codes.

