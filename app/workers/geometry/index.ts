// Phase 6 placeholder — Geometry kernel dispatcher
export interface FittingStrategy {
  type: string;
  loss: (params: Record<string, number>) => number;
}

export function dispatch(type: string): FittingStrategy | null {
  // TODO: return concrete strategies per spec
  return null;
}

