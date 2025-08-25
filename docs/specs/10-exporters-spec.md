# Exporters Spec (PDF, CSV, DXF) (Draft v0.1)

## Libraries (proposal)
- PDF: pdf-lib (offline, no headless dependency)
- CSV: native CSV stringify (UTF‑8, RFC 4180-ish)
- DXF: dxf-writer or @tarikjabiri/dxf (start with basic entities)

## Data Mapping
- PDF: cover page (project/job meta), results tables (segments), warnings list, optional logo
- CSV: segments.csv (inputs), results.csv (computed outputs), endpoints.csv, locations.csv
- DXF: simplified plan—nodes as blocks, ducts as polylines with width labels; scale annotations

## Determinism & Units
- Lock unit system per export; include unit headers; stable ordering by job → order_index → id

## Errors & Recovery
- Missing fonts/images → fallback to defaults with warning
- Invalid geometry → skip entity and log warning

## Versioning
- Include app version & ruleset hash in PDF footer and CSV headers; DXF header comment

