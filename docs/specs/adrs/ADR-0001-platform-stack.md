# ADR-0001 — Platform Stack (Desktop-Only)

Status: Accepted
Date: 2025-09-01

## Problem
Choose a delivery platform and app stack optimized for offline-first desktop usage with reliable updates and OS integration.

## Decision
- The application MUST be desktop-only (Windows/macOS/Linux). Smartphones and mobile app stores are out of scope.
- The platform MUST be Electron (Chromium + Node) with a multi-process model (Main, Renderer, Worker Threads).
- The UI framework MUST be React; state management SHOULD use Zustand (or equivalent) with predictable selectors.
- The DB engine MUST be SQLite via better-sqlite3 in the Main process; journal mode WAL.
- IPC MUST use contextIsolation with a typed contextBridge API; no Node in the renderer.

## Consequences
### Positive
- Consistent desktop behavior and stable OS-level features
- Offline-first flows with fast local DB and predictable updates

### Negative
- Larger binaries than native frameworks
- Requires careful IPC contracts and security configuration

## Implementation Requirements
- Enforce desktop-only language and remove mobile/touch gestures from docs and UI
- Preload exposes a minimal, typed API surface; all inputs validated in Main
- DB migrations and WAL mode enforced on startup

