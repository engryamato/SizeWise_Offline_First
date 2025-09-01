# Performance Harness (Documents Only)

## Datasets
- Small: ≤300 segments
- Medium: ≤2,000 segments
- Large: ≤10,000 segments

## Measurements
- Input→result latency (P95) after 3 warmups and 10 measured edits
- Bulk recompute time (P95)
- Canvas FPS steady-state
- Memory (RSS) after bulk recompute

## Protocol
- Baseline hardware: i5-11400/16GB/NVMe (Win11) or Apple M1/16GB (macOS13+)
- Disable background sync/updates; fix Electron/Node versions
- Log OS/CPU/RAM and app versions in output

## Acceptance
- Medium bulk recompute ≤2.5s (P95), Large ≤12s (P95)
- Canvas panning ≥55 FPS steady on Large
- Memory caps: ≤300MB (Small), ≤900MB (Medium), ≤1.5GB (Large)

