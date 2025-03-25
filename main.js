const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let hatSelectorWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the main window
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

  mainWindow.loadFile('index.html');
  mainWindow.setIgnoreMouseEvents(true, { forward: true }); // Ignore mouse events globally by default

  // Listen for renderer events to toggle mouse events
  ipcMain.on('toggle-mouse-events', (event, ignoreMouseEvents) => {
    mainWindow.setIgnoreMouseEvents(ignoreMouseEvents, { forward: !ignoreMouseEvents });
  });

  // Create the hat selector window
  hatSelectorWindow = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  hatSelectorWindow.loadFile('hat-selector.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('change-hat', (event, hat) => {
    mainWindow.webContents.send('hat-changed', hat); // Forward hat change to the main window
  });

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
