# Sample Data (Draft v0.1)

## Sample .sizewise (minimal)
```json
{
  "format": "sizewise",
  "version": 1,
  "createdAt": "2025-08-25T00:00:00Z",
  "appVersion": "0.1.0",
  "project": { "id": "p1", "name": "Demo", "unitSystem": "imperial" },
  "entities": {
    "jobs": [{ "id": "j1", "projectId": "p1", "title": "Supply Main", "altitudeFt": 0 }],
    "segments": [{ "id": "s1", "jobId": "j1", "shape": "rect", "width_in": 18, "height_in": 12, "length_ft": 25, "cfm": 850 }],
    "endpoints": [],
    "locations": [],
    "results": []
  },
  "meta": { "units": "imperial" },
  "integrity": { "algo": "SHA-256", "hash": "", "signed": false, "signature": null },
  "encryption": { "alg": null, "iv": null, "kdf": null }
}
```

## Seed SQL
```sql
INSERT INTO projects (id, name, unit_system) VALUES ('p1', 'Demo', 'imperial');
INSERT INTO duct_jobs (id, project_id, title, altitude_ft) VALUES ('j1', 'p1', 'Supply Main', 0);
INSERT INTO duct_segments (id, job_id, order_index, shape, width_in, height_in, length_ft, cfm)
VALUES ('s1','j1',1,'rect',18,12,25,850);
```

