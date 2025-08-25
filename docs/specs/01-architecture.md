# SizeWise Offline-First: Architecture (C4)

Status: Draft v0.2
Scope: Desktop-only (Electron). Smartphones are out of scope. Tablets are supported only when running a desktop OS (Windows/macOS/Linux). No service workers or sql.js are in scope for v1.

## Goals

- Clear process and module boundaries
- Deterministic data flow for offline-first and sync
- Separation of concerns: Calc, Data, Sync, Licensing, Updates, Telemetry

## C1: Context Diagram (high level)

```mermaid
flowchart TB
    User((HVAC Engineer))
    App[SizeWise Desktop (Electron)]
    FS[(Local Filesystem)]
    DB[(SQLite DB)]
    Cloud[(Optional Sync API)]
    Updates[(Release Provider: GitHub/S3)]
    Keystore[(OS Keystore)]

    User --> App
    App <---> DB
    App <---> FS
    App -.optional.- Cloud
    App -.autoUpdater.- Updates
    App <---> Keystore
```

## C2: Container Diagram (processes and major containers)

```mermaid
flowchart LR
  subgraph Electron Main Process
    M1[Data Service (better-sqlite3)]
    M2[Sync Agent]
    M3[Licensing Service]
    M4[Update Service (electron-updater)]
    M5[Export/Import Service]
    M6[Telemetry Broker]
  end

  subgraph Renderer (React/Next)
    R1[UI Shell]
    R2[Inputs/Results Panels]
    R3[Jobs/Segments State]
  end

  subgraph Worker Threads
    W1[Calc Engine]
  end

  DB[(SQLite)]
  FS[(Filesystem)]
  Cloud[(Sync API)]
  Updates[(Updates Provider)]
  Key[(OS Keystore)]

  R1 <--IPC--> M1
  R2 <--IPC--> W1
  R1 <--IPC--> M2
  R1 <--IPC--> M3
  R1 <--IPC--> M4
  R1 <--IPC--> M5
  R1 <--IPC--> M6

  M1 <--> DB
  M5 <--> FS
  M2 <-HTTPS-> Cloud
  M4 <-HTTPS-> Updates
  M3 <--> Key
```

IPC = Electron IPC or secure contextBridge APIs

## C3: Component Diagram (selected containers)

Data Service (Main)

- Responsibilities: migrations, WAL mode, CRUD, transactions, import/export roundtrip verification
- Interfaces: DataStore (see Module Contracts doc)

Sync Agent (Main)

- Responsibilities: mutation queue, retries/backoff, version vectors or ETags, tombstones, conflict detection/merge
- Interfaces: SyncClient

Calc Engine (Worker)

- Responsibilities: deterministic calculations; pure functions where possible
- Interfaces: CalcEngine

Licensing (Main)

- Responsibilities: license verification, tier limits, grace state; secrets via OS keystore
- Interfaces: LicensingService

Update Service (Main)

- Responsibilities: channels, download/apply, signature verification, rollback strategy
- Interfaces: UpdateService

Telemetry Broker (Main)

- Responsibilities: privacy-preserving analytics/crash; user consent gating; local buffering
- Interfaces: TelemetryService

UI (Renderer)

- Responsibilities: state management, input validation before dispatch, conflict resolution UI
- Interfaces: calls via IPC-safe facades

## Cross-cutting Concerns

- Security: at-rest encryption for sensitive data, signed updates, sanitized logs
- Observability: structured logs with correlation IDs; crash & perf metrics (opt-in)
- Performance: worker offload for calc; debounce; batched DB writes; indexed queries
- Offline-first: command queue, idempotent ops, conflict policy, user-resolvable diffs
