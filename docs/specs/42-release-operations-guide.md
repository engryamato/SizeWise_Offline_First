# Release Operations Guide (Documents Only)

## Steps
1. Cut release branch; bump version
2. Build and sign per OS; notarize macOS
3. Publish to chosen provider; attach release notes and checksums
4. Promote beta → stable if no blocking issues
5. Monitor crash/perf metrics (opt-in) and support tickets
6. Rollback if needed using cached previous installer

## Templates
- Release notes sections: Features, Fixes, Breaking Changes, Known Issues
- Checklist per OS (signing/notarization)

