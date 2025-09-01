# Release Operations Guide (Documents Only)

## Steps
1. Freeze window: no non-critical merges 48 hours before planned release
2. Cut release branch; bump version
3. Build and sign per OS; notarize macOS; staple tickets
4. Publish to GitHub Releases; attach release notes and checksums
5. Smoke test on each OS; then promote beta → stable if no blocking issues
6. Monitor crash/perf metrics (opt-in) and support tickets
7. Rollback if needed using cached previous installer and allowDowngrade policy

## Templates
- Release notes sections: Features, Fixes, Breaking Changes, Known Issues
- Checklist per OS (signing/notarization)

