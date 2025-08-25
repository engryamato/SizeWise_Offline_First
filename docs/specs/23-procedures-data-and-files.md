# Procedure: Data & File Flows (Documents Only)

## Steps
1. Cross-check Notion schema vs 03-sizewise-file-format.md entities; align naming/IDs
2. Author canonicalization rules (key order, omit nulls) and add to 03
3. Write import transaction plan (upsert order: projects → locations/endpoints → jobs → segments → results)
4. Define integrity/signature verification order and failure messaging
5. Define backup/restore process and retention policy

## Outputs
- Import/export flowchart
- Canonicalization example (before→after)
- Backup/restore SOP

