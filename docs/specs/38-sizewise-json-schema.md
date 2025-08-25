# .sizewise JSON Schema (Draft v0.1)

Purpose: normative schema for project export/import files.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sizewise.app/schemas/sizewise.schema.json",
  "title": "SizeWise Project",
  "type": "object",
  "required": ["format", "version", "project", "entities", "integrity"],
  "properties": {
    "format": { "const": "sizewise" },
    "version": { "type": "integer", "minimum": 1 },
    "createdAt": { "type": "string" },
    "appVersion": { "type": "string" },
    "meta": { "type": "object", "properties": { "units": { "enum": ["imperial", "metric"] } }, "additionalProperties": true },
    "project": {
      "type": "object",
      "required": ["id", "name", "unitSystem"],
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "unitSystem": { "enum": ["imperial", "metric"] },
        "notes": { "type": "string" }
      },
      "additionalProperties": true
    },
    "entities": {
      "type": "object",
      "required": ["jobs", "segments", "endpoints", "locations", "results"],
      "properties": {
        "jobs": { "type": "array", "items": { "type": "object", "required": ["id", "projectId", "title"], "additionalProperties": true } },
        "segments": { "type": "array", "items": { "type": "object", "required": ["id", "jobId", "length_ft", "cfm"], "additionalProperties": true } },
        "endpoints": { "type": "array" },
        "locations": { "type": "array" },
        "results": { "type": "array" }
      },
      "additionalProperties": false
    },
    "integrity": {
      "type": "object",
      "required": ["algo", "hash"],
      "properties": {
        "algo": { "const": "SHA-256" },
        "hash": { "type": "string" },
        "signed": { "type": "boolean" },
        "signature": { "type": ["string", "null"] }
      },
      "additionalProperties": false
    },
    "encryption": {
      "type": "object",
      "properties": {
        "alg": { "enum": ["AES-256-GCM", null] },
        "iv": { "type": ["string", "null"] },
        "kdf": { "type": ["object", "null"] }
      },
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

