# Procedure: Architecture & Services (Documents Only)

Goal: Turn architecture blueprint into implementable structure without coding.

## Steps
1. Confirm desktop-only scope and remove mobile in Notion
2. Freeze container boundaries (Main/Renderer/Worker) per 01-architecture.md
3. List required services and their IPC façades (Data, Calc, Export, Licensing, Updates, Telemetry)
4. For each facade, map methods to module contracts in 02-module-contracts.md
5. Approve directory layout (see 16-implementation-blueprints.md)
6. Define startup order: DB migrate → IPC wiring → window creation
7. Define error boundaries: Main validation before DB; renderer guards

## Outputs
- Service catalog with method lists
- Startup sequence diagram (Mermaid)
- Finalized directory structure record

