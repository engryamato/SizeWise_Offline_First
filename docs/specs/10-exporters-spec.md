# Exporters Spec (PDF, CSV, DXF) (Draft v0.2)

## Libraries & Rendering Paths
- PDF (primary): Electron webContents.printToPDF via hidden/offscreen BrowserWindow
- PDF (fallback): pdf-lib for data-only composition (no HTML rendering)
- CSV: native CSV stringify (UTF‑8, RFC 4180-ish)
- DXF: dxf-writer v4.x (or @tarikjabiri/dxf) behind an adapter

## PDF via Electron
- Create a hidden BrowserWindow to load an HTML report template
- Embed fonts with @font-face; inline CSS for determinism
- Use printToPDF options for page size, margins, background graphics
- Include app version, ruleset hash, and export timestamp in footer

## CSV Mapping
- segments.csv: inputs (ids, geometry, airflow, material, fittings, endpoints, locations)
- results.csv: computed outputs (velocity, Reynolds, friction/100ft, fittings loss, total loss, pressure class)
- endpoints.csv, locations.csv as reference tables
- Deterministic ordering: job → order_index → id

## DXF Conventions
- DXF version: R2018
- Units: inches (INSUNITS=1)
- Layers: DUCT_MAIN, FITTINGS, LABELS, NODES, GUIDES
- Text style: SIZEWISE_STD (height 0.125 in), font Arial or embedded SHX
- Colors: fixed index map per layer; document in adapter
- Blocks: define fittings (elbows, tees) with consistent insertion points
- Performance: support up to ~100k entities; chunk writes to avoid memory spikes

## Errors & Recovery
- Missing fonts/images → fallback to defaults with warning
- Invalid geometry → skip entity and log warning
- DXF write failure → abort file and emit actionable error; never produce partial corrupt files

## Versioning & Provenance
- Include app version & ruleset hash in PDF footer and CSV headers; DXF header comment
- Record exporter version (adapter version) in file metadata where applicable
