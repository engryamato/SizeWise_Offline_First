// Phase 2 — Electron main process (dev shell + DataService IPC)
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { DataService, DbError } from './services/DataService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const isDev = !!process.env.VITE_DEV_SERVER_URL;
let dataService: DataService | null = null;

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.ts'), // ts execution assumed in dev
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Production: load built renderer index.html
    win.loadFile(join(process.cwd(), 'dist/renderer/index.html'));
  }
}

// Helpers
function normalizeError(e: any) {
  if (e instanceof DbError) return { code: e.code, message: e.message } as const;
  return { code: 'E_DB_UNKNOWN', message: String(e) } as const;
}

// IPC: app
ipcMain.handle('app:ping', async () => 'pong');

// IPC: DataService
ipcMain.handle('db:init', async () => {
  try {
    const dbPath = join(app.getPath('userData'), 'sizewise.db');
    dataService = new DataService(dbPath);
    dataService.init();
    return { ok: true, dbPath, journalMode: dataService.journalMode };
  } catch (e) {
    return { ok: false, error: normalizeError(e) };
  }
});

ipcMain.handle('db:journalMode', async () => {
  if (!dataService) return { ok: false, error: { code: 'E_DB_OPEN', message: 'DB not initialized' } };
  return { ok: true, journalMode: dataService.journalMode, foreignKeys: dataService.foreignKeys };
});

ipcMain.handle('db:listProjects', async () => {
  try {
    if (!dataService) throw new DbError('E_DB_OPEN', 'DB not initialized');
    const db: any = (dataService as any).db;
    const rows = db.prepare("SELECT id, name, unit_system, created_at, updated_at FROM projects ORDER BY name").all();
    return { ok: true, projects: rows };
  } catch (e) {
    return { ok: false, error: normalizeError(e) };
  }
});

ipcMain.handle('db:getEngineSetting', async (_evt, key: string) => {
  try {
    if (!dataService) throw new DbError('E_DB_OPEN', 'DB not initialized');
    const value = dataService.getEngineSetting(key);
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: normalizeError(e) };
  }
});

ipcMain.handle('db:setEngineSetting', async (_evt, key: string, value: unknown) => {
  try {
    if (!dataService) throw new DbError('E_DB_OPEN', 'DB not initialized');
    dataService.setEngineSetting(key, value);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: normalizeError(e) };
  }
});

app.whenReady().then(() => {
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

