# Developer Setup (Draft v0.1)

## Prereqs
- Node LTS (>=18)
- pnpm or npm
- OS toolchains (Xcode CLT for macOS; MSVC Build Tools for Windows) for better-sqlite3

## Install
- pnpm install (or npm install)

## Run
- pnpm dev (starts Electron + renderer)

## Build
- pnpm build (renderer) then pnpm dist (electron-builder)

## Environment
- userData path used for DB (e.g., %APPDATA%/SizeWise)
- WAL mode enabled; logs in userData/logs

## Code Standards
- TypeScript strict mode; ESLint + Prettier; Conventional Commits

## Secrets
- Managed via OS keychain (keytar). Do not commit keys.

