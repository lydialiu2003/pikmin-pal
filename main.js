const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra'); // Use fs-extra for easy directory copying
const { showNativeNotification } = require('./reminderWindow'); // Import the native notification function

let mainWindow;

function copyAssetsToUserData() {
  const sourceAssetsPath = path.join(__dirname, 'assets'); // Explicitly use the project root's assets directory
  const targetAssetsPath = path.join(app.getPath('userData'), 'assets'); // Copy to userData directory

  console.log('Source Assets Path:', sourceAssetsPath);
  console.log('Target Assets Path:', targetAssetsPath);

  try {
    if (!fs.existsSync(sourceAssetsPath)) {
      console.error(`Source assets directory not found: ${sourceAssetsPath}`);
      return targetAssetsPath; // Return target path even if source is missing
    }

    fs.ensureDirSync(targetAssetsPath); // Ensure the target directory exists
    fs.copySync(sourceAssetsPath, targetAssetsPath, { overwrite: true }); // Recursively copy all assets
    console.log(`Assets copied to: ${targetAssetsPath}`);
  } catch (error) {
    console.error('Error copying assets:', error.message);
  }

  return targetAssetsPath;
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const targetAssetsPath = copyAssetsToUserData(); // Ensure assets are copied before creating the window

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(targetAssetsPath, 'icons/pikmin-pal.png'), // Set the app icon globally
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false, // Disable webSecurity to allow local resource loading
      additionalArguments: [`--userDataPath=${app.getPath('userData')}`], // Pass userData path
    },
    frame: false,
    transparent: true,
    alwaysOnTop: true,
  });

  // Enable click-through behavior
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  ipcMain.on('enable-mouse-events', () => {
    console.log('Mouse events enabled');
    mainWindow.setIgnoreMouseEvents(false); // Allow interaction
  });

  ipcMain.on('disable-mouse-events', () => {
    console.log('Mouse events disabled');
    mainWindow.setIgnoreMouseEvents(true, { forward: true }); // Make window click-through
  });

  // Load the main HTML file
  mainWindow.loadFile(path.join(__dirname, 'index.html')).catch((err) => {
    console.error('Failed to load index.html:', err);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('show-water-reminder', () => {
  console.log('Received show-water-reminder event');
  showNativeNotification();
});

app.on('ready', () => {
  app.setAppUserModelId('com.pikmin.pal'); // Set the app user model ID for Windows
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
