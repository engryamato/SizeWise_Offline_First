# Procedure: Ruleset Seed (Documents Only)

## Steps
1. Generate a ruleset-seed.json matching 20-ruleset-json-schema.md with TBD values
2. Add placeholder citations to be filled by engineering references
3. Define review checklist for constants (units, ranges, rounding)

## Outputs
- ruleset-seed.json (document-only example embedded in this file)

## Example (document only)
```json
{
  "rulesetVersion": "2025.08",
  "sources": [ { "name": "ASHRAE Fundamentals", "chapter": "Fluid Flow" } ],
  "air": { "rho_lbm_per_ft3": 0.075, "mu_slug_per_ft_s": 3.8e-7, "temperature_F": 70, "pressure_atm": 1 },
  "materials": {
    "galvanized_steel": { "epsilon_ft": 0.0005, "source": "SMACNA Table TBD" }
  },
  "fittings": {
    "elbow_90": { "K": 0.75, "source": "SMACNA Table TBD", "notes": "radius dependent" }
  },
  "corrections": { "altitude_model": "standard_atmosphere", "temperature_model": "ideal_gas" }
}
```

