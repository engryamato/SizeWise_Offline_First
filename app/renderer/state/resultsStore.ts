import { create } from 'zustand';
import type { ResultRow, ID } from './types';

export type ResultsState = {
  resultsByRun: Record<ID, ResultRow | undefined>;
  setResultForRun: (runId: ID, result: ResultRow | undefined) => void;
};

export const useResultsStore = create<ResultsState>((set) => ({
  resultsByRun: {},
  setResultForRun: (runId, result) => set((s) => ({ resultsByRun: { ...s.resultsByRun, [runId]: result } })),
}));

