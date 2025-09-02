import React from 'react';
import { useProjectsStore } from './state/projectsStore';
import { useCanvasStore } from './state/canvasStore';
import { CanvasRoot } from './canvas/CanvasRoot';

declare global {
  interface Window {
    api: {
      ping: () => Promise<string>;
      dbInit: () => Promise<any>;
      dbJournalMode: () => Promise<any>;
      dbListProjects: () => Promise<any>;
      dbGetEngineSetting: (key: string) => Promise<any>;
      dbSetEngineSetting: (key: string, value: unknown) => Promise<any>;
    };
  }
}

export default function App() {
  const [resp, setResp] = React.useState<string>('');
  const [dbInfo, setDbInfo] = React.useState<any>(null);

  const { projects, refreshProjectsFromDb } = useProjectsStore();
  const canvas = useCanvasStore();

  React.useEffect(() => {
    window.api.ping().then(setResp).catch(() => setResp('error'));
  }, []);

  const initDb = async () => {
    const r = await window.api.dbInit();
    setDbInfo(r);
    // Apply canvas settings defaults from DB if present
    const keys = ['canvas.snap_grid_in','canvas.snap_angle_deg','canvas.snap_radius_in'];
    const entries = await Promise.all(keys.map(async (k) => [k, (await window.api.dbGetEngineSetting(k))?.value] as const));
    canvas.applyEngineSettings(Object.fromEntries(entries));
    await refreshProjectsFromDb();
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h1>SizeWise Dev Shell</h1>
      <p>IPC ping: {resp}</p>
      <button onClick={initDb}>Init DB</button>
      <pre style={{ background: '#f6f8fa', padding: 12 }}>
        {dbInfo ? JSON.stringify(dbInfo, null, 2) : 'Click Init DB to initialize'}
      </pre>

      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>{p.name} ({p.unit_system})</li>
        ))}
      </ul>

      <h2>Canvas</h2>
      <CanvasRoot />

      <h2>Canvas Settings</h2>
      <div>snapGridIn: {canvas.snapGridIn}, snapAngleDeg: {canvas.snapAngleDeg}, snapRadiusIn: {canvas.snapRadiusIn}</div>
    </div>
  );
}

