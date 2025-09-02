import { create } from 'zustand';

export type Viewport = { x: number; y: number; scale: number };
export type Selection = { ids: string[] };

export type CanvasState = {
  viewport: Viewport;
  selection: Selection;
  isDragging: boolean;
  snapGridIn: number;
  snapAngleDeg: number;
  snapRadiusIn: number;
  setViewport: (vp: Viewport) => void;
  setSelection: (ids: string[]) => void;
  setDragging: (dragging: boolean) => void;
  applyEngineSettings: (settings: Record<string, any>) => void;
};

export const useCanvasStore = create<CanvasState>((set) => ({
  viewport: { x: 0, y: 0, scale: 1 },
  selection: { ids: [] },
  isDragging: false,
  snapGridIn: 1,
  snapAngleDeg: 15,
  snapRadiusIn: 6,
  setViewport: (vp) => set({ viewport: vp }),
  setSelection: (ids) => set({ selection: { ids } }),
  setDragging: (isDragging) => set({ isDragging }),
  applyEngineSettings: (s) => set((state) => ({
    snapGridIn: s['canvas.snap_grid_in'] ?? state.snapGridIn,
    snapAngleDeg: s['canvas.snap_angle_deg'] ?? state.snapAngleDeg,
    snapRadiusIn: s['canvas.snap_radius_in'] ?? state.snapRadiusIn,
  })),
}));

