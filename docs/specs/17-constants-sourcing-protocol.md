# Constants Sourcing Protocol (Documentation only)

Goal: Convert provisional engineering constants into verified, versioned data with citations.

## Steps
1. Inventory all constants used (air properties, roughness, fitting K values, altitude/temperature corrections)
2. Source citations (ASHRAE Fundamentals, SMACNA HVAC Systems Duct Design). Record exact table/figure/page
3. Capture values and ranges; note conditions (temperature, surface condition, Reynolds range)
4. Normalize units and define conversions; lock rounding
5. Assign a Ruleset version + hash; store in a JSON file (checked into repo)
6. Add a changelog explaining any differences from prior versions

## JSON Layout (example)
```json
{
  "rulesetVersion": "2025.08",
  "sources": [
    { "name": "ASHRAE Fundamentals 2021", "chapter": "Fluid Flow" },
    { "name": "SMACNA HVAC Systems Duct Design" }
  ],
  "air": { "rho_lbm_per_ft3": 0.075, "mu_slug_per_ft_s": 3.8e-7 },
  "materials": {
    "galvanized_steel": { "epsilon_ft": 0.0005, "source": "SMACNA Table X" },
    "stainless": { "epsilon_ft": 0.00015, "source": "SMACNA Table Y" }
  },
  "fittings": { "elbow_90": { "K": 0.75, "note": "radius-dependent" } }
}
```

## Validation
- Unit tests assert presence and bounds; CI prevents release if constants are missing or unverifiable

