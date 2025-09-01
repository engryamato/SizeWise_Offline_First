import { app, BrowserWindow } from 'electron';

function createWindow() {
  const win = new BrowserWindow({ width: 1200, height: 800, webPreferences: { preload: __dirname + '/../preload/index.js', contextIsolation: true, nodeIntegration: false } });
  win.loadURL('http://localhost:5173'); // placeholder for Vite dev server
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

