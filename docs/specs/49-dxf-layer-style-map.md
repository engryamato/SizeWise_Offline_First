# DXF Layer & Style Map (Documents Only)

## DXF Profile
- Version: R2018
- Units: inches (INSUNITS=1)
- UCS: World; origin (0,0,0); scale annotations consistent with inches

## Layers
| Layer        | Color | Linetype | Purpose                        |
|--------------|-------|----------|--------------------------------|
| DUCT_MAIN    | 7     | CONTINUOUS | Main duct polylines            |
| FITTINGS     | 3     | CONTINUOUS | Elbows, tees, transitions      |
| LABELS       | 2     | CONTINUOUS | Text labels (sizes, CFM)       |
| NODES        | 1     | CONTINUOUS | Node markers (equipment/ends)  |
| GUIDES       | 8     | DASHED     | Construction/snap guides       |

## Text Style
- Style name: SIZEWISE_STD
- Font: Arial (fallback SHX if unavailable)
- Height: 0.125 in (change via config if needed)
- Color: layer color

## Blocks (Fittings)
- Names: ELBOW_90_LR, ELBOW_45, TEE, TRANSITION
- Insertion point: centerline intersection
- Scaling: uniform; rotation aligns with duct direction

## Conventions
- Label format: "<width>x<height> @ <CFM>" for rect; "Ø<diam> @ <CFM>" for round
- Precision: dimensions 0.1 in; CFM as integer
- Ordering: write nodes → ducts → fittings → labels for deterministic output

## Performance
- Target: up to ~100k entities
- Chunk writes to avoid memory spikes; flush after each 5k entities

## Metadata
- Header comments include app version, ruleset hash, and exporter adapter version

