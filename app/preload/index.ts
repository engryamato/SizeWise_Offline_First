// Phase 2 — Preload bridge
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  ping: async (): Promise<string> => ipcRenderer.invoke('app:ping'),
  dbInit: async () => ipcRenderer.invoke('db:init'),
  dbJournalMode: async () => ipcRenderer.invoke('db:journalMode'),
  dbListProjects: async () => ipcRenderer.invoke('db:listProjects'),
  dbGetEngineSetting: async (key: string) => ipcRenderer.invoke('db:getEngineSetting', key),
  dbSetEngineSetting: async (key: string, value: unknown) => ipcRenderer.invoke('db:setEngineSetting', key, value),
});

export {}; // ensure module

