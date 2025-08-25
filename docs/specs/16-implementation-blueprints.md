# Implementation Blueprints (Documentation only)

This provides concrete, minimal patterns for how the architecture will be realized without delivering runnable code. Snippets are illustrative and align to our module contracts.

## Electron + better-sqlite3 integration
- Use contextIsolation: true; preload exposes typed APIs only
- Main creates DataService with WAL enabled; migrations applied at startup

```ts
// main/bootstrap.ts
app.whenReady().then(async () => {
  const dbPath = join(app.getPath('userData'), 'sizewise.db');
  const data = new DataService(dbPath);
  await data.migrate();
  wireIpc({ data, calc, updates, licensing, exportSvc });
  createMainWindow();
});
```

```ts
// main/data-service.ts (shape only)
class DataService {
  constructor(private path: string) { /* open better-sqlite3; PRAGMAs */ }
  migrate() {/* read schema_version; run sql/00N_*.sql sequentially in tx */}
  createProject(p: Project) {/* prepared stmt */}
  listProjects() {/* SELECT with ordering */}
}
```

## IPC façades via preload
- Single namespace per service; return Result<T> or throw standardized errors

```ts
// preload.ts (shape only)
contextBridge.exposeInMainWorld('api', {
  data: { createProject: (p) => ipcRenderer.invoke('data:createProject', p) },
  calc: { computeSegment: (i) => ipcRenderer.invoke('calc:computeSegment', i) },
});
```

## Worker thread calc
- Dedicated worker; promise wrapper around postMessage

```ts
// main/calc-service.ts (shape only)
class CalcService {
  private w = new Worker(resolve(__dirname, 'calc-worker.js'));
  computeSegment(i: SegmentInput): Promise<SegmentResult> {/* promise/resolve pattern */}
}
```

## Import/Export flow (.sizewise)
- Export: query normalized entities → canonicalize → integrity hash → (optional sign/encrypt) → write file
- Import: read header → verify integrity/signature → (optional decrypt) → validate schema → upsert entities in tx

```ts
// export outline
const doc = buildSizewiseDocument(projectId);
const canonical = canonicalize(doc);
const hash = sha256(canonical);
await writeFile(path, withIntegrity(doc, hash));
```

## Error handling pattern
- Normalize thrown values to { code, message, details? } and surface user-friendly text

```ts
function normalizeError(e: unknown): { code: ErrorCode; message: string; details?: any } { /* map */ }
```

## Directory layout (proposal)
```
/ sql/                  # migrations
/ docs/specs/           # this folder
/ app/main/             # electron main (services, ipc)
/ app/renderer/         # React UI
/ app/preload/          # contextBridge
/ app/workers/          # calc
```

