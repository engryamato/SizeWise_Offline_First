# Ruleset JSON Schema for HVAC Constants (Draft v0.1)

Purpose: Define a normative schema for verified engineering constants used by the calculation engine. This lets us lock values with citations, version them, and drive golden tests.

## JSON Schema (concise)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sizewise.app/schemas/ruleset.schema.json",
  "title": "SizeWise Ruleset",
  "type": "object",
  "required": ["rulesetVersion", "sources", "air", "materials", "fittings"],
  "properties": {
    "rulesetVersion": { "type": "string", "pattern": "^\\d{4}\\.\\d{2}$" },
    "hash": { "type": "string", "description": "SHA-256 of canonicalized content" },
    "sources": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["name"],
        "properties": {
          "name": { "type": "string" },
          "edition": { "type": "string" },
          "chapter": { "type": "string" },
          "table": { "type": "string" },
          "pages": { "type": "string" }
        },
        "additionalProperties": false
      }
    },
    "air": {
      "type": "object",
      "required": ["rho_lbm_per_ft3", "mu_slug_per_ft_s", "temperature_F", "pressure_atm"],
      "properties": {
        "rho_lbm_per_ft3": { "type": "number" },
        "mu_slug_per_ft_s": { "type": "number" },
        "temperature_F": { "type": "number" },
        "pressure_atm": { "type": "number" },
        "notes": { "type": "string" }
      },
      "additionalProperties": false
    },
    "materials": {
      "type": "object",
      "minProperties": 1,
      "patternProperties": {
        "^[_a-zA-Z0-9-]+$": {
          "type": "object",
          "required": ["epsilon_ft", "source"],
          "properties": {
            "epsilon_ft": { "type": "number", "minimum": 0 },
            "source": { "type": "string" },
            "conditions": { "type": "string" },
            "range_ft": { "type": "array", "items": { "type": "number" }, "minItems": 2, "maxItems": 2 }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "fittings": {
      "type": "object",
      "description": "Loss coefficients; may be parameterized by geometry",
      "patternProperties": {
        "^[_a-zA-Z0-9-]+$": {
          "type": "object",
          "properties": {
            "K": { "type": "number", "minimum": 0 },
            "param": {
              "type": "object",
              "properties": {
                "by_radius_ratio": {
                  "type": "array",
                  "items": { "type": "object", "properties": { "R_over_D": { "type": "number" }, "K": { "type": "number" } }, "required": ["R_over_D", "K"], "additionalProperties": false }
                }
              },
              "additionalProperties": false
            },
            "source": { "type": "string" },
            "notes": { "type": "string" }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "corrections": {
      "type": "object",
      "properties": {
        "altitude_model": { "type": "string", "enum": ["standard_atmosphere"] },
        "temperature_model": { "type": "string", "enum": ["ideal_gas"] }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

## Acceptance Criteria
- All values include a `source` field citing exact reference (workbook, chapter/table/page)
- Schema validation passes in CI; hash is reproducible (canonicalization rules per file format spec)
- A ruleset version + hash is displayed in-app and included in exports

