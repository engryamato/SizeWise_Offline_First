# IPC API Reference (Documents Only)

Normative catalog of IPC channels, payloads, and results. Maps to 02-module-contracts.md.

## Conventions
- All requests are invoke/handle pairs
- Payloads and results are JSON-serializable
- Errors are normalized { code, message, details? }

## Data (window.api.data)
- data:createProject(project: Project) → string (id)
- data:listProjects() → Project[]
- data:updateProject(id: string, patch: Partial<Project>) → void
- data:deleteProject(id: string) → void
- data:createJob(job: DuctJob) → string
- data:listJobs(projectId: string) → DuctJob[]
- data:updateJob(id: string, patch: Partial<DuctJob>) → void
- data:deleteJob(id: string) → void
- data:createSegment(seg: DuctSegment) → string
- data:listSegments(jobId: string) → DuctSegment[]
- data:updateSegment(id: string, patch: Partial<DuctSegment>) → void
- data:deleteSegment(id: string) → void
- data:upsertLocation(loc: Location) → void
- data:upsertEndpoint(ep: Endpoint) → void

## Calc (window.api.calc)
- calc:computeSegment(input: SegmentInput) → SegmentResult
- calc:computeJob(input: JobInput) → JobResults

## Export (window.api.export)
- export:project(projectId: string, options?: ExportOptions) → { path: string, hash: string }
- import:file(path: string, options?: ImportOptions) → { projectId: string }

## Licensing (window.api.licensing)
- lic:current() → LicenseState
- lic:apply(licenseBlob: string | Buffer) → void
- lic:verify() → LicenseVerificationResult

## Updates (window.api.updates)
- updates:check() → UpdateCheckResult
- updates:download(version?: string) → DownloadResult
- updates:apply() → void

## Telemetry (window.api.telemetry)
- telemetry:setConsent(enabled: boolean) → void
- telemetry:track(event: TelemetryEvent) → void
- telemetry:flush() → void

