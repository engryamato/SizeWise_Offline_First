# SizeWise Module Contracts (Draft v0.1)

Types shown in TypeScript for clarity; actual runtime uses Electron IPC-safe facades.

## DataStore
```ts
export interface DataStore {
  init(): Promise<void>;
  migrate(targetVersion?: number): Promise<void>;
  tx<T>(fn: (db: unknown) => Promise<T>): Promise<T>;

  // Projects
  createProject(p: Project): Promise<string>;
  updateProject(id: string, updates: Partial<Project>): Promise<void>;
  getProject(id: string): Promise<Project | null>;
  listProjects(): Promise<Project[]>;
  deleteProject(id: string): Promise<void>;

  // Jobs/Segments
  createJob(j: DuctJob): Promise<string>;
  listJobs(projectId: string): Promise<DuctJob[]>;
  updateJob(id: string, updates: Partial<DuctJob>): Promise<void>;
  deleteJob(id: string): Promise<void>;

  createSegment(s: DuctSegment): Promise<string>;
  updateSegment(id: string, updates: Partial<DuctSegment>): Promise<void>;
  listSegments(jobId: string): Promise<DuctSegment[]>;
  deleteSegment(id: string): Promise<void>;

  // Endpoints/Locations
  upsertLocation(loc: Location): Promise<void>;
  upsertEndpoint(ep: Endpoint): Promise<void>;
}
```

## CalcEngine
```ts
export interface CalcEngine {
  computeSegment(input: SegmentInput): Promise<SegmentResult>;
  computeJob(jobInput: JobInput): Promise<JobResults>;
}
```

## SyncClient
```ts
export interface SyncClient {
  enqueue(cmd: MutationCommand): Promise<void>;
  flush(options?: { force?: boolean }): Promise<FlushResult>;
  resolve(conflict: ConflictResolution): Promise<void>;
}
```

## LicensingService
```ts
export interface LicensingService {
  current(): Promise<LicenseState>; // free/pro/grace/trial, limits
  applyLicense(licenseBlob: string | Buffer): Promise<void>;
  verify(): Promise<LicenseVerificationResult>;
}
```

## UpdateService
```ts
export interface UpdateService {
  check(): Promise<UpdateCheckResult>;
  download(version?: string): Promise<DownloadResult>;
  apply(): Promise<void>; // may restart app
}
```

## TelemetryService
```ts
export interface TelemetryService {
  setConsent(enabled: boolean): Promise<void>;
  track(event: TelemetryEvent): Promise<void>;
  flush(): Promise<void>;
}
```

## Error Taxonomy (preview)
```ts
export type ErrorCode =
  | 'E_INPUT_VALIDATION'
  | 'E_DB_CONSTRAINT'
  | 'E_DB_CORRUPTION'
  | 'E_EXPORT_FORMAT'
  | 'E_IMPORT_FORMAT'
  | 'E_SYNC_NETWORK'
  | 'E_SYNC_CONFLICT'
  | 'E_LIC_INVALID'
  | 'E_UPDATE_VERIFY'
  | 'E_SECURITY_ENCRYPTION';
```

