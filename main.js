const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { createReminderWindow } = require('./reminderWindow');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
    frame: false,
    transparent: true,
    alwaysOnTop: true,
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  ipcMain.on('enable-mouse-events', () => {
    console.log('Mouse events enabled');
    mainWindow.setIgnoreMouseEvents(false);
  });

  ipcMain.on('disable-mouse-events', () => {
    console.log('Mouse events disabled');
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
  });

  // Use the reminder window logic from the new file
  ipcMain.on('show-water-reminder', () => {
    createReminderWindow();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Main window finished loading');
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
