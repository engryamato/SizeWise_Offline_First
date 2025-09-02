import { create } from 'zustand';
import type { Project, Job, ID } from './types';

export type ProjectsState = {
  projects: Project[];
  jobsByProject: Record<ID, Job[]>;
  currentProjectId: ID | null;
  currentJobId: ID | null;
  // actions
  setProjects: (projects: Project[]) => void;
  setJobsForProject: (projectId: ID, jobs: Job[]) => void;
  selectProject: (projectId: ID | null) => void;
  selectJob: (jobId: ID | null) => void;
  refreshProjectsFromDb: () => Promise<void>;
};

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  jobsByProject: {},
  currentProjectId: null,
  currentJobId: null,

  setProjects: (projects) => set({ projects }),
  setJobsForProject: (projectId, jobs) => set((s) => ({ jobsByProject: { ...s.jobsByProject, [projectId]: jobs } })),
  selectProject: (projectId) => set({ currentProjectId: projectId, currentJobId: null }),
  selectJob: (jobId) => set({ currentJobId: jobId }),

  refreshProjectsFromDb: async () => {
    const r = await window.api.dbListProjects();
    if (r?.ok) set({ projects: r.projects as Project[] });
  },
}));

