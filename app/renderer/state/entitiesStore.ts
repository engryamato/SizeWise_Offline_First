import { create } from 'zustand';
import type { Endpoint, DuctRun, Fitting, ID } from './types';

export type EntitiesState = {
  endpointsByJob: Record<ID, Endpoint[]>;
  ductRunsByJob: Record<ID, DuctRun[]>;
  fittingsByRun: Record<ID, Fitting[]>;
  setEndpointsForJob: (jobId: ID, endpoints: Endpoint[]) => void;
  setDuctRunsForJob: (jobId: ID, runs: DuctRun[]) => void;
  setFittingsForRun: (runId: ID, fittings: Fitting[]) => void;
};

export const useEntitiesStore = create<EntitiesState>((set) => ({
  endpointsByJob: {},
  ductRunsByJob: {},
  fittingsByRun: {},
  setEndpointsForJob: (jobId, endpoints) => set((s) => ({ endpointsByJob: { ...s.endpointsByJob, [jobId]: endpoints } })),
  setDuctRunsForJob: (jobId, runs) => set((s) => ({ ductRunsByJob: { ...s.ductRunsByJob, [jobId]: runs } })),
  setFittingsForRun: (runId, fittings) => set((s) => ({ fittingsByRun: { ...s.fittingsByRun, [runId]: fittings } })),
}));

