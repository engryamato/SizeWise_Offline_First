# Ruleset Governance (Documents Only)

## Versioning
- Semantic versioning for ruleset (e.g., 1.0.0)
- Compatibility matrix recorded with app versions
- Default/kill-switch: default_ruleset_version the app reverts to on verification failure

## Compatibility Example
- App 1.x supports Ruleset ^1
- App 2.x supports Ruleset ^2 and ^1 in compatibility mode

## Rollback SOP
- On ruleset verification failure, revert to default_ruleset_version
- Raise a telemetry event (opt-in) and show banner explaining downgrade
- Add incident entry to known issues

## Review Checklist
- Each constant carries source citation and conditions
- Tolerances recorded (± acceptable for tests)
- Diff from prior version captured in changelog notes

